const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examType: {
    type: String,
    required: true,
    enum: ['CT1', 'CT2', 'CT3', 'FINAL'],
  },
  year: { type: Number, required: true },
  semester: { type: Number, required: true, enum: [1, 2] },
  questionNumber: { type: String }, // e.g., "Q1", "Q2(a)"
  questionText: { type: String, required: true },
  marks: { type: Number },
  tags: [{ type: String }], // e.g., ["sorting", "binary tree"]
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  hasFormula: { type: Boolean, default: false },
  formula: { type: String }, // LaTeX formula string
  pdfFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: Date
  },
  isPublished: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Text index for search
questionSchema.index({ questionText: 'text', tags: 'text' });
questionSchema.index({ subject: 1, examType: 1, year: -1 });

questionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema);
