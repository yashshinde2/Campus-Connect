const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const Post = require('../models/Post');
const Group = require('../models/Group');

exports.getSearchResults = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query.trim()) {
            return res.render('search/index', {
                title: 'Global Search - Campus Connect',
                query: '',
                results: { notices: [], events: [], resources: [], posts: [], groups: [] }
            });
        }

        const regex = new RegExp(query, 'i');

        const [notices, events, resources, posts, groups] = await Promise.all([
            Notice.find({ $or: [{ title: regex }, { description: regex }] }).limit(5),
            Event.find({ $or: [{ title: regex }, { description: regex }, { venue: regex }] }).limit(5),
            Resource.find({ status: 'approved', $or: [{ title: regex }, { description: regex }, { subject: regex }] }).limit(5),
            Post.find({ $or: [{ title: regex }, { content: regex }] }).limit(5),
            Group.find({ $or: [{ name: regex }, { description: regex }] }).limit(5)
        ]);

        res.render('search/index', {
            title: `Search results for "${query}" - Campus Connect`,
            query,
            results: { notices, events, resources, posts, groups }
        });
    } catch (err) {
        console.error('getSearchResults Error:', err);
        req.flash('error_msg', 'Error processing global search.');
        res.redirect('/dashboard');
    }
};
