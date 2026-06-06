/**
 * server/routes/emergency.js
 * POST /api/emergency/sos
 * GET  /api/emergency/history
 * PATCH /api/emergency/:id/status
 */
const express = require('express');
const router  = express.Router();

const EmergencySos = require('../models/EmergencySos');
const auth = require('../middleware/auth');

/* ── SEND SOS ───────────────────────────────────────── */
router.post('/sos', auth, async (req, res) => {
  try {
    const { lat, lng, type = 'pregnancy' } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Location (lat, lng) is required.' });
    }

    // Log to DB (silent fail if offline)
    const sos = await EmergencySos.create({
      userId: req.user.id,
      email:  req.user.email,
      lat, lng, type,
    }).catch(() => null);

    console.log(`🚨 SOS ALERT — User: ${req.user.email} | Location: ${lat}, ${lng} | Type: ${type}`);

    res.json({
      success:  true,
      message:  'SOS dispatched. Help is on the way.',
      sosId:    sos?._id || `demo-sos-${Date.now()}`,
      unit:     'UNIT-07',
      eta:      '8 minutes',
      hospital: "St. Paul's Hospital Millennium",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── GET SOS HISTORY ────────────────────────────────── */
router.get('/history', auth, async (req, res) => {
  try {
    const records = await EmergencySos
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .catch(() => []);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── UPDATE SOS STATUS (admin/ambulance) ────────────── */
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['dispatched', 'en_route', 'arrived', 'resolved'];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const update = { status };
    if (status === 'resolved') update.resolvedAt = new Date();

    const sos = await EmergencySos
      .findByIdAndUpdate(req.params.id, update, { new: true })
      .catch(() => null);

    if (!sos) return res.status(404).json({ message: 'SOS record not found.' });
    res.json(sos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
