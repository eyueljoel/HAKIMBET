/**
 * server/middleware/auth.js
 * JWT authentication middleware
 *
 * auth      — hard: blocks request if no/invalid token
 * softAuth  — soft: attaches user if token present, but never blocks
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hakim-wellness-secret-2026';

/* Hard auth — requires valid token */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

/* Soft auth — never blocks, just attaches user when token is valid */
function softAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (_) {
      // Invalid/expired token — continue as anonymous
      req.user = { id: 'anonymous', name: 'Guest', email: '' };
    }
  } else {
    req.user = { id: 'anonymous', name: 'Guest', email: '' };
  }
  next();
}

module.exports = auth;
module.exports.softAuth = softAuth;
