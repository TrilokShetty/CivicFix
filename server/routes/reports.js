const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');
const { classifyToDepartment } = require('../utils/nlp');
const fs = require('fs');

// Middleware to verify token (Inline for simplicity)
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const jwt = require('jsonwebtoken'); // Need to import here for middleware

// Set up Multer for storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// @route   POST api/reports
// @desc    Create a report
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { description, lat, lng, address } = req.body;

        // NLP Classification
        const department = await classifyToDepartment(description);
        const category = department;

        const newReport = new Report({
            user: req.user.id,
            description,
            category,
            department,
            location: {
                lat,
                lng,
                address
            },
            photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
            status: 'Submitted'
        });

        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/my
// @desc    Get user's reports
// @access  Private
router.get('/my', auth, async (req, res) => {
    try {
        const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/reports/department
// @desc    Get reports for user's department (Department Head)
// @access  Private
router.get('/department', auth, async (req, res) => {
    try {
        // ideally checking role to be department_head
        if (req.user.role !== 'department_head' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        let query = {};
        if (req.user.department) {
            query.department = req.user.department;
        }

        const reports = await Report.find(query).sort({ createdAt: -1 }).populate('user', ['name', 'email']);
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
