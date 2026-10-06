const Notice = require('../models/Notice');
const getPagination = require('../utils/pagination');

exports.getNotices = async (req, res) => {
    try {
        const { category, search, sort, page = 1 } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { isPinned: -1, isUrgent: -1, createdAt: -1 };
        if (sort === 'deadline') sortOption = { deadline: 1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };

        const limit = 9;
        const totalItems = await Notice.countDocuments(query);
        const pagination = getPagination(page, limit, totalItems);

        const notices = await Notice.find(query)
            .sort(sortOption)
            .skip(pagination.skip)
            .limit(limit)
            .populate('author', 'name');

        res.render('notices/index', {
            title: 'Campus Notices - Campus Connect',
            notices,
            pagination,
            currentCategory: category || 'All',
            currentSearch: search || '',
            currentSort: sort || 'newest'
        });
    } catch (err) {
        console.error('getNotices Error:', err);
        req.flash('error_msg', 'Could not load notices.');
        res.redirect('/dashboard');
    }
};

exports.getNoticeDetail = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'name email department');

        if (!notice) {
            req.flash('error_msg', 'Notice not found.');
            return res.redirect('/notices');
        }

        const relatedNotices = await Notice.find({
            _id: { $ne: notice._id },
            category: notice.category
        }).limit(3);

        res.render('notices/detail', {
            title: `${notice.title} - Campus Connect`,
            notice,
            relatedNotices
        });
    } catch (err) {
        console.error('getNoticeDetail Error:', err);
        req.flash('error_msg', 'Notice details could not be loaded.');
        res.redirect('/notices');
    }
};
