const express = require('express');
const router = express.Router();
const PracticeQuestion = require('../models/PracticeQuestion');
const Subject = require('../models/Subject');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/practice - Public
router.get('/', async (req, res) => {
  try {
    const { subject, type, difficulty, topic, page = 1, limit = 20, random } = req.query;
    const filter = { isPublished: true };

    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = new RegExp(topic, 'i');

    if (subject) {
      const subjectDoc = await Subject.findOne({ code: subject.toUpperCase() });
      if (subjectDoc) filter.subject = subjectDoc._id;
    }

    let query = PracticeQuestion.find(filter).populate('subject', 'name code color icon');

    if (random === 'true') {
      // Random selection for practice sessions
      const count = await PracticeQuestion.countDocuments(filter);
      const randomSkip = Math.max(0, Math.floor(Math.random() * count) - parseInt(limit));
      query = query.skip(randomSkip);
    } else {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      query = query.skip(skip);
    }

    const total = await PracticeQuestion.countDocuments(filter);
    const questions = await query.limit(parseInt(limit)).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: questions,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/practice/quiz/:subjectCode - Generate a random quiz
router.get('/quiz/:subjectCode', async (req, res) => {
  try {
    const { count = 10, type, difficulty } = req.query;
    const subject = await Subject.findOne({ code: req.params.subjectCode.toUpperCase() });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });

    const filter = { subject: subject._id, isPublished: true };
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    // Aggregate random questions
    const questions = await PracticeQuestion.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(count) } },
      { $project: { correctAnswer: 0, explanation: 0 } } // Hide answers for quiz mode
    ]);

    res.json({ success: true, subject, data: questions, total: questions.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/practice/:id/answer - Get answer (public, for self-checking)
router.get('/:id/answer', async (req, res) => {
  try {
    const question = await PracticeQuestion.findById(req.params.id).select('correctAnswer explanation');
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    // Increment attempt count
    PracticeQuestion.findByIdAndUpdate(req.params.id, { $inc: { attemptCount: 1 } }).exec();

    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/practice - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const questionData = { ...req.body, createdBy: req.user._id };

    if (req.body.tags && typeof req.body.tags === 'string') {
      questionData.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const question = await PracticeQuestion.create(questionData);
    await question.populate('subject', 'name code');
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/practice/:id - Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await PracticeQuestion.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/practice/:id - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await PracticeQuestion.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Practice question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
