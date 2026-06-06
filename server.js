/**
 * ================================================
 *  HAKIM ሃኪም — Express Entry Point
 *  npm start   → production (Render)
 *  npm run dev → development (nodemon)
 * ================================================
 */

'use strict';

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const connectDB = require('./server/config/db');

/* ── Route imports ────────────────────────────────── */
const authRoutes      = require('./server/routes/auth');
const trackerRoutes   = require('./server/routes/tracker');
const emergencyRoutes = require('./server/routes/emergency');
const aiRoutes        = require('./server/routes/ai');
const wellnessRoutes  = require('./server/routes/wellness');

/* ── App ──────────────────────────────────────────── */
const app  = express();
/* Render injects PORT automatically — must use it */
const PORT = parseInt(process.env.PORT, 10) || 5000;

/* ── Database ─────────────────────────────────────── */
connectDB();

/* ── CORS ─────────────────────────────────────────── */
const ALLOWED_ORIGINS = [
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,  // Vercel URL, set in Render env vars
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    /* No origin = Postman / mobile / Render health-check → allow */
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    /* In development allow everything */
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    return callback(new Error('CORS: origin ' + origin + ' not allowed'));
  },
  credentials: true,
}));

/* ── Body parsers ─────────────────────────────────── */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Security headers (no helmet dep needed) ─────── */
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

/* ── Health check — MUST be before auth middleware ── */
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    app:     'Hakim Wellness API',
    version: '1.0.0',
    env:     process.env.NODE_ENV || 'development',
    time:    new Date().toISOString(),
  });
});

/* ── API routes ───────────────────────────────────── */
app.use('/api/auth',      authRoutes);
app.use('/api/tracker',   trackerRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/wellness',  wellnessRoutes);

/* ── Serve frontend in dev / also on Render if needed */
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, 'client')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
} else {
  /* Production: API-only on Render, frontend on Vercel */
  app.get('/', (req, res) => {
    res.json({
      status:   'ok',
      message:  'Hakim API running on Render',
      frontend: process.env.FRONTEND_URL || 'https://hakimbet.vercel.app',
      docs:     '/api/health',
    });
  });
  /* 404 for unknown routes */
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

/* ── Global error handler ─────────────────────────── */
app.use((err, req, res, _next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

/* ── Start ────────────────────────────────────────── */
app.listen(PORT, '0.0.0.0', () => {
  /* '0.0.0.0' is required by Render — localhost alone won't work */
  const env = process.env.NODE_ENV || 'development';
  console.log('\n🌿 ══════════════════════════════════════');
  console.log('   Hakim Wellness API');
  console.log(`   ENV  : ${env}`);
  console.log(`   PORT : ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log('══════════════════════════════════════\n');
});
