const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    topic: { type: String, default: 'General' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentCount: { type: Number, default: 0 }
}, { timestamps: true });

postSchema.index({ title: 'text', content: 'text', topic: 'text' });

module.exports = mongoose.model('Post', postSchema);
