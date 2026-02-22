const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { protect, adminOnly } = require('../middleware/auth');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/pdfs');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// GET /api/questions - Public
router.get('/', async (req, res) => {
  try {
    const { subject, examType, year, semester, search, page = 1, limit = 20 } = req.query;
    const filter = { isPublished: true };

    if (examType) filter.examType = examType;
    if (year) filter.year = parseInt(year);
    if (semester) filter.semester = parseInt(semester);

    if (subject) {
      const subjectDoc = await Subject.findOne({ code: subject.toUpperCase() });
      if (subjectDoc) filter.subject = subjectDoc._id;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .populate('subject', 'name code color icon')
      .populate('createdBy', 'name')
      .sort({ year: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Increment view count (fire and forget)
    if (questions.length > 0) {
      Question.updateMany({ _id: { $in: questions.map(q => q._id) } }, { $inc: { viewCount: 1 } }).exec();
    }

    res.json({
      success: true,
      data: questions,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/questions/by-subject/:code - Public - Grouped by exam type
router.get('/by-subject/:code', async (req, res) => {
  try {
    const subject = await Subject.findOne({ code: req.params.code.toUpperCase() });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });

    const questions = await Question.find({ subject: subject._id, isPublished: true })
      .populate('createdBy', 'name')
      .sort({ year: -1, questionNumber: 1 });

    const grouped = {
      CT1: questions.filter(q => q.examType === 'CT1'),
      CT2: questions.filter(q => q.examType === 'CT2'),
      CT3: questions.filter(q => q.examType === 'CT3'),
      FINAL: questions.filter(q => q.examType === 'FINAL'),
    };

    res.json({ success: true, subject, data: grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/questions/:id - Public
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('subject', 'name code color icon');
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/questions - Admin only
router.post('/', protect, adminOnly, upload.single('pdfFile'), async (req, res) => {
  try {
    const questionData = { ...req.body, createdBy: req.user._id };

    if (req.file) {
      questionData.pdfFile = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        uploadedAt: new Date()
      };
    }

    // Handle tags array
    if (req.body.tags && typeof req.body.tags === 'string') {
      questionData.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const question = await Question.create(questionData);
    await question.populate('subject', 'name code');

    res.status(201).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/questions/:id - Admin only
router.put('/:id', protect, adminOnly, upload.single('pdfFile'), async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };

    if (req.file) {
      updateData.pdfFile = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        uploadedAt: new Date()
      };
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      updateData.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const question = await Question.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    res.json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/questions/:id - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    // Delete associated PDF file if exists
    if (question.pdfFile && question.pdfFile.path && fs.existsSync(question.pdfFile.path)) {
      fs.unlinkSync(question.pdfFile.path);
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/questions/download/:id/pdf - Public
router.get('/download/:id/pdf', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question || !question.pdfFile) {
      return res.status(404).json({ success: false, message: 'PDF not found' });
    }

    const filePath = question.pdfFile.path;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${question.pdfFile.originalName}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
