const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  semester: { type: Number, required: true, enum: [1, 2] },
  description: { type: String, trim: true },
  icon: { type: String, default: '📚' },
  color: { type: String, default: '#6366f1' },
  syllabus: [{ type: String }], // Array of topics
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

subjectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);
