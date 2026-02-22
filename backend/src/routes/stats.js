const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const PracticeQuestion = require('../models/PracticeQuestion');
const Subject = require('../models/Subject');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/stats - Admin dashboard stats
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const [
      totalQuestions,
      totalPractice,
      totalSubjects,
      questionsByType,
      questionsBySubject,
      recentQuestions
    ] = await Promise.all([
      Question.countDocuments({ isPublished: true }),
      PracticeQuestion.countDocuments({ isPublished: true }),
      Subject.countDocuments({ isActive: true }),
      Question.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$examType', count: { $sum: 1 } } }
      ]),
      Question.aggregate([
        { $match: { isPublished: true } },
        { $lookup: { from: 'subjects', localField: 'subject', foreignField: '_id', as: 'subjectInfo' } },
        { $group: { _id: '$subject', name: { $first: { $arrayElemAt: ['$subjectInfo.name', 0] } }, code: { $first: { $arrayElemAt: ['$subjectInfo.code', 0] } }, count: { $sum: 1 } } }
      ]),
      Question.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('subject', 'name code color')
        .select('questionText examType year subject createdAt')
    ]);

    res.json({
      success: true,
      data: {
        totalQuestions,
        totalPractice,
        totalSubjects,
        questionsByType,
        questionsBySubject,
        recentQuestions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
