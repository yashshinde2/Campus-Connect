const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const getPagination = require('../utils/pagination');

exports.getFeed = async (req, res) => {
    try {
        const { topic, search, sort = 'latest', page = 1 } = req.query;
        let query = {};

        if (topic && topic !== 'All') query.topic = topic;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'popular') sortOption = { commentCount: -1, 'likes.length': -1 };

        const limit = 10;
        const totalItems = await Post.countDocuments(query);
        const pagination = getPagination(page, limit, totalItems);

        const posts = await Post.find(query)
            .sort(sortOption)
            .skip(pagination.skip)
            .limit(limit)
            .populate('author', 'name department avatar')
            .populate('group', 'name');

        res.render('community/index', {
            title: 'Community Feed - Campus Connect',
            posts,
            pagination,
            currentTopic: topic || 'All',
            currentSearch: search || '',
            currentSort: sort
        });
    } catch (err) {
        console.error('getFeed Error:', err);
        req.flash('error_msg', 'Could not load community feed.');
        res.redirect('/dashboard');
    }
};

exports.getCreate = (req, res) => {
    res.render('community/create', { title: 'Create Community Post - Campus Connect' });
};

exports.postCreate = async (req, res) => {
    try {
        const { title, content, topic, groupId } = req.body;
        const post = await Post.create({
            title,
            content,
            topic: topic || 'General',
            group: groupId || null,
            author: req.session.user._id
        });

        req.flash('success_msg', 'Post created successfully!');
        res.redirect(`/community/${post._id}`);
    } catch (err) {
        console.error('postCreate Error:', err);
        req.flash('error_msg', 'Could not create post.');
        res.redirect('/community/create');
    }
};

exports.getPostDetail = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name department avatar')
            .populate('group', 'name');

        if (!post) {
            req.flash('error_msg', 'Post not found.');
            return res.redirect('/community');
        }

        const comments = await Comment.find({ post: post._id })
            .sort({ createdAt: 1 })
            .populate('author', 'name avatar department');

        res.render('community/detail', {
            title: `${post.title} - Community`,
            post,
            comments
        });
    } catch (err) {
        console.error('getPostDetail Error:', err);
        req.flash('error_msg', 'Could not load post detail.');
        res.redirect('/community');
    }
};

exports.postComment = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found.');
            return res.redirect('/community');
        }

        await Comment.create({
            post: post._id,
            author: req.session.user._id,
            content,
            parent: parentId || null
        });

        post.commentCount += 1;
        await post.save();

        // Notify Post author if not replying to self
        if (post.author.toString() !== req.session.user._id.toString()) {
            await Notification.create({
                user: post.author,
                type: 'reply',
                message: `${req.session.user.name} commented on your post "${post.title.substring(0, 30)}..."`,
                link: `/community/${post._id}`
            });
        }

        req.flash('success_msg', 'Comment posted!');
        res.redirect(`/community/${post._id}`);
    } catch (err) {
        console.error('postComment Error:', err);
        req.flash('error_msg', 'Could not post comment.');
        res.redirect(`/community/${req.params.id}`);
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found.');
            return res.redirect('/community');
        }

        if (post.author.toString() !== req.session.user._id.toString() && req.session.user.role !== 'admin') {
            req.flash('error_msg', 'Unauthorized to delete this post.');
            return res.redirect('/community');
        }

        await Post.findByIdAndDelete(post._id);
        await Comment.deleteMany({ post: post._id });

        req.flash('success_msg', 'Post deleted successfully.');
        res.redirect('/community');
    } catch (err) {
        console.error('deletePost Error:', err);
        req.flash('error_msg', 'Could not delete post.');
        res.redirect('/community');
    }
};
