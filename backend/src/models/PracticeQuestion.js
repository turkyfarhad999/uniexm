const mongoose = require('mongoose');

const practiceQuestionSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  type: { type: String, enum: ['MCQ', 'SHORT', 'LONG', 'PROBLEM'], required: true },
  questionText: { type: String, required: true },
  options: [{ // For MCQ
    label: String, // A, B, C, D
    text: String,
  }],
  correctAnswer: { type: String }, // For MCQ: label (A/B/C/D), for others: model answer
  explanation: { type: String },
  topic: { type: String }, // Specific topic from syllabus
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  marks: { type: Number, default: 5 },
  tags: [{ type: String }],
  isAIGenerated: { type: Boolean, default: false }, // For future AI integration
  isPublished: { type: Boolean, default: true },
  attemptCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

practiceQuestionSchema.index({ subject: 1, type: 1, difficulty: 1 });
practiceQuestionSchema.index({ questionText: 'text', topic: 'text', tags: 'text' });

practiceQuestionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('PracticeQuestion', practiceQuestionSchema);
