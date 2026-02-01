const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true // 'Streetlight', 'Pothole', 'Trash', 'Other' (predicted by AI)
    },
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    photoUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['Submitted', 'In Progress', 'Resolved'],
        default: 'Submitted'
    },
    department: {
        type: String // e.g., 'Electrical', 'Public Works'
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
