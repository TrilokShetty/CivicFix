const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'department_head'],
        default: 'user'
    },
    department: {
        type: String, // e.g., 'Electrical', 'Public Works' (only for department_head)
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
