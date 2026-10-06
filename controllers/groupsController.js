const Group = require('../models/Group');
const Post = require('../models/Post');

exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name')
            .populate('members', 'name avatar');

        res.render('groups/index', {
            title: 'Study Groups - Campus Connect',
            groups
        });
    } catch (err) {
        console.error('getGroups Error:', err);
        req.flash('error_msg', 'Could not load study groups.');
        res.redirect('/dashboard');
    }
};

exports.postGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const group = await Group.create({
            name,
            description,
            createdBy: req.session.user._id,
            members: [req.session.user._id]
        });

        req.flash('success_msg', `Study group "${group.name}" created successfully!`);
        res.redirect(`/groups/${group._id}`);
    } catch (err) {
        console.error('postGroup Error:', err);
        req.flash('error_msg', 'Could not create study group. Name may already exist.');
        res.redirect('/groups');
    }
};

exports.getGroupDetail = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('members', 'name avatar department course');

        if (!group) {
            req.flash('error_msg', 'Study group not found.');
            return res.redirect('/groups');
        }

        const groupPosts = await Post.find({ group: group._id })
            .sort({ createdAt: -1 })
            .populate('author', 'name avatar');

        const isMember = group.members.some(m => m._id.toString() === req.session.user._id.toString());

        res.render('groups/detail', {
            title: `${group.name} - Study Group`,
            group,
            groupPosts,
            isMember
        });
    } catch (err) {
        console.error('getGroupDetail Error:', err);
        req.flash('error_msg', 'Could not load group details.');
        res.redirect('/groups');
    }
};
