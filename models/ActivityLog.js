const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetType: { type: String, default: '' },
    targetId: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
