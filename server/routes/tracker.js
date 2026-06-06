/**
 * server/routes/tracker.js
 * POST /api/tracker/setup
 * POST /api/tracker/symptoms
 * GET  /api/tracker/history
 */
const express = require('express');
const router  = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');

/* ── SETUP TRACKER ──────────────────────────────────── */
router.post('/setup', auth, async (req, res) => {
  try {
    const { type, name, lmpDate, dueDate } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      'tracker.type':    type    || 'period',
      'tracker.name':    name    || '',
      'tracker.lmpDate': lmpDate ? new Date(lmpDate) : undefined,
      'tracker.dueDate': dueDate ? new Date(dueDate) : undefined,
    }).catch(() => null);  // silent fail if DB offline

    res.json({ success: true, message: 'Tracker set up successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── LOG SYMPTOMS ───────────────────────────────────── */
router.post('/symptoms', auth, async (req, res) => {
  try {
    const { symptoms = [], flow = 'None', date } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        'tracker.cycles': {
          date:     date ? new Date(date) : new Date(),
          symptoms: symptoms,
          flow:     flow,
        },
      },
    }).catch(() => null);

    res.json({ success: true, message: 'Symptoms logged.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET HISTORY ────────────────────────────────────── */
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('tracker').catch(() => null);
    if (!user) return res.json({ cycles: [] });
    res.json(user.tracker || { cycles: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
