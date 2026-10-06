const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const Post = require('../models/Post');
const User = require('../models/User');
const Group = require('../models/Group');

exports.ajaxSearch = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (query.trim().length < 2) {
            return res.json({ results: [] });
        }

        const regex = new RegExp(query, 'i');
        const results = [];

        const [notices, events, resources, posts] = await Promise.all([
            Notice.find({ title: regex }).limit(3),
            Event.find({ title: regex }).limit(3),
            Resource.find({ status: 'approved', title: regex }).limit(3),
            Post.find({ title: regex }).limit(3)
        ]);

        notices.forEach(n => results.push({ title: n.title, type: 'Notice', url: `/notices/${n._id}`, snippet: n.description.substring(0, 60) }));
        events.forEach(e => results.push({ title: e.title, type: 'Event', url: `/events/${e._id}`, snippet: `${e.venue} | ${new Date(e.date).toLocaleDateString()}` }));
        resources.forEach(r => results.push({ title: r.title, type: 'Resource', url: `/resources`, snippet: `${r.subject} (${r.type})` }));
        posts.forEach(p => results.push({ title: p.title, type: 'Community', url: `/community/${p._id}`, snippet: p.content.substring(0, 60) }));

        res.json({ results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toggleBookmark = async (req, res) => {
    try {
        const noticeId = req.params.id;
        const user = await User.findById(req.session.user._id);

        const index = user.bookmarks.findIndex(b => b.item && b.item.toString() === noticeId);
        let bookmarked = false;

        if (index > -1) {
            user.bookmarks.splice(index, 1);
        } else {
            user.bookmarks.push({ kind: 'Notice', item: noticeId });
            bookmarked = true;
        }

        await user.save();
        res.json({ success: true, bookmarked });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.toggleRSVP = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.session.user._id;
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const index = event.attendees.indexOf(userId);
        let isAttending = false;

        if (index > -1) {
            event.attendees.splice(index, 1);
        } else {
            if (event.attendees.length >= event.capacity) {
                return res.json({ success: false, message: 'Event capacity reached' });
            }
            event.attendees.push(userId);
            isAttending = true;
        }

        await event.save();
        res.json({ success: true, isAttending, count: event.attendees.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
