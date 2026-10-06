const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    targetType: { type: String, enum: ['post', 'comment', 'resource', 'user'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'resolved', 'dismissed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
