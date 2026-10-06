const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Exam', 'Academic', 'Event', 'General', 'Placement'], required: true },
    isPinned: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    deadline: { type: Date, default: null },
    attachment: {
        path: { type: String, default: '' },
        originalName: { type: String, default: '' }
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 }
}, { timestamps: true });

noticeSchema.index({ title: 'text', description: 'text' });
noticeSchema.index({ category: 1, isPinned: -1, isUrgent: -1, createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
