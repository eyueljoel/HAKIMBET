/**
 * server/models/User.js
 * Mongoose User schema
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const cycleLogSchema = new mongoose.Schema({
  date:     { type: Date, default: Date.now },
  symptoms: [{ type: String }],
  flow:     { type: String, default: 'None' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone:    { type: String, default: '' },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },

  tracker: {
    type:    { type: String, enum: ['pregnant', 'period', 'both'], default: 'period' },
    name:    { type: String, default: '' },
    lmpDate: { type: Date },
    dueDate: { type: Date },
    cycles:  [cycleLogSchema],
  },

  wellness: {
    age:           Number,
    gender:        String,
    weight:        Number,
    height:        Number,
    activityLevel: String,
    goal:          String,
  },

  createdAt: { type: Date, default: Date.now },
});

/* Hash password before save */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* Compare plain password to hash */
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

/* Strip password from JSON output */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
