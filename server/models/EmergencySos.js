/**
 * server/models/EmergencySos.js
 * Emergency SOS dispatch record
 */
const mongoose = require('mongoose');

const emergencySosSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,   // allow guest SOS
  },
  email: { type: String, default: '' },
  lat:   { type: Number, required: true },
  lng:   { type: Number, required: true },
  type:  { type: String, enum: ['pregnancy', 'general', 'farmer'], default: 'pregnancy' },
  status: {
    type: String,
    enum: ['dispatched', 'en_route', 'arrived', 'resolved'],
    default: 'dispatched',
  },
  unit:  { type: String, default: 'UNIT-07' },
  eta:   { type: String, default: '8 minutes' },
  resolvedAt: { type: Date },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmergencySos', emergencySosSchema);
