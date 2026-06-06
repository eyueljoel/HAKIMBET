/**
 * server/routes/auth.js
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/auth/me
 */
const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'hakim-wellness-secret-2026';

function signToken(user, remember = false) {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: remember ? '30d' : '7d' }
  );
}

/* ── REGISTER ───────────────────────────────────────── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Try DB (may be offline in demo mode)
    let user;
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: 'Email already registered.' });

      user = await User.create({ name, email, password, phone: phone || '' });
    } catch (_dbErr) {
      // DB offline — issue a demo token so the frontend still works
      const demoUser = { id: `demo-${Date.now()}`, name, email };
      return res.status(201).json({ token: signToken(demoUser), user: demoUser, demo: true });
    }

    const token = signToken(user);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

/* ── LOGIN ──────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // ── Special guest account (always works, no DB needed) ──
    if (email === 'guest@hakim.app' && password === 'guest123') {
      const guestUser = { id: 'guest-' + Date.now(), name: 'Guest', email: 'guest@hakim.app' };
      const token = signToken(guestUser, false);
      return res.json({ token, user: guestUser });
    }

    let user;
    try {
      user = await User.findOne({ email });
    } catch (_) {
      // DB offline — issue demo token
      const demoUser = { id: `demo-${Date.now()}`, name: 'Demo User', email };
      return res.json({ token: signToken(demoUser, remember), user: demoUser, demo: true });
    }

    if (!user) {
      return res.status(401).json({ message: 'No account found with that email.' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = signToken(user, !!remember);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

/* ── GET ME ─────────────────────────────────────────── */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      // Demo token — return payload from token
      return res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
    }
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
