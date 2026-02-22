const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Question = require('../models/Question');
const PracticeQuestion = require('../models/PracticeQuestion');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/subjects - Public
router.get('/', async (req, res) => {
  try {
    const { semester } = req.query;
    const filter = { isActive: true };
    if (semester) filter.semester = parseInt(semester);

    const subjects = await Subject.find(filter).sort({ semester: 1, name: 1 });

    // Add question counts
    const subjectsWithCounts = await Promise.all(subjects.map(async (sub) => {
      const qCount = await Question.countDocuments({ subject: sub._id, isPublished: true });
      const pCount = await PracticeQuestion.countDocuments({ subject: sub._id, isPublished: true });
      return { ...sub.toObject(), questionCount: qCount, practiceCount: pCount };
    }));

    res.json({ success: true, data: subjectsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/subjects/:code - Public
router.get('/:code', async (req, res) => {
  try {
    const subject = await Subject.findOne({ code: req.params.code.toUpperCase(), isActive: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/subjects - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/subjects/:id - Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/subjects/:id - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Subject.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Subject deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
