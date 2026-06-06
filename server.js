/**
 * ================================================
 *  HAKIM ሃኪም — Express Entry Point
 *  Run:  npm start          (production)
 *        npm run dev        (nodemon watch)
 * ================================================
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const connectDB = require('./server/config/db');

/* ── Routes ───────────────────────────────────────── */
const authRoutes      = require('./server/routes/auth');
const trackerRoutes   = require('./server/routes/tracker');
const emergencyRoutes = require('./server/routes/emergency');
const aiRoutes        = require('./server/routes/ai');
const wellnessRoutes  = require('./server/routes/wellness');

/* ── App init ─────────────────────────────────────── */
const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Database ─────────────────────────────────────── */
connectDB();

/* ── CORS — allow localhost dev + Vercel production ─ */
const ALLOWED_ORIGINS = [
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5000',
  process.env.FRONTEND_URL,           // e.g. https://hakim-wellness.vercel.app
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, Render health checks)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // In development allow everything
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── API Routes ───────────────────────────────────── */
app.use('/api/auth',      authRoutes);
app.use('/api/tracker',   trackerRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/ai',        aiRoutes);
app.use('/api/wellness',  wellnessRoutes);

/* ── Health check ─────────────────────────────────── */
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    app:     'Hakim ሃኪም Wellness Super-App',
    version: '1.0.0',
    time:    new Date().toISOString(),
  });
});

/* ── Serve static frontend (local dev only) ──────── */
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, 'client')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });
} else {
  /* In production on Render — only API, frontend is on Vercel */
  app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Hakim API is running. Frontend is at your Vercel URL.' });
  });
}

/* ── Global error handler ─────────────────────────── */
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ message: err.message || 'Internal server error.' });
});

/* ── Start ────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log('\n🌿 ══════════════════════════════════════════');
  console.log('   Hakim ሃኪም — Wellness Super-App');
  console.log('══════════════════════════════════════════');
  console.log(`   Server  → http://localhost:${PORT}`);
  console.log(`   App     → http://localhost:${PORT}/index.html`);
  console.log(`   Dashboard → http://localhost:${PORT}/dashboard.html`);
  console.log(`   API     → http://localhost:${PORT}/api/health`);
  console.log('══════════════════════════════════════════\n');
});
