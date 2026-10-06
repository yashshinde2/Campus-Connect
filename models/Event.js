const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    capacity: { type: Number, required: true, default: 100 },
    banner: { type: String, default: '' },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

eventSchema.index({ title: 'text', description: 'text', venue: 'text' });
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);
