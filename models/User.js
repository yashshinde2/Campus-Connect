const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    course: { type: String, default: '' },
    department: { type: String, default: '' },
    year: { type: Number, default: 1 },
    semester: { type: Number, default: 1 },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    bookmarks: [{
        kind: { type: String, enum: ['Notice', 'Event', 'Resource', 'Post'] },
        item: { type: mongoose.Schema.Types.ObjectId, refPath: 'bookmarks.kind' }
    }],
    preferences: {
        notifyNotices: { type: Boolean, default: true },
        notifyEvents: { type: Boolean, default: true },
        notifyReplies: { type: Boolean, default: true }
    },
    resetTokenHash: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    lastLogin: { type: Date, default: null }
}, { timestamps: true });

userSchema.index({ name: 'text', email: 'text', department: 'text' });

module.exports = mongoose.model('User', userSchema);
