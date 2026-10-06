const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    semester: { type: Number, required: true },
    type: { type: String, enum: ['note', 'pdf', 'ppt', 'image', 'link'], required: true },
    filePath: { type: String, default: '' },
    linkUrl: { type: String, default: '' },
    originalName: { type: String, default: '' },
    size: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectionReason: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downloads: { type: Number, default: 0 },
    reportsCount: { type: Number, default: 0 }
}, { timestamps: true });

resourceSchema.index({ title: 'text', description: 'text', subject: 'text' });
resourceSchema.index({ status: 1, subject: 1, semester: 1, type: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
