const path = require('path');
const Resource = require('../models/Resource');
const getPagination = require('../utils/pagination');

exports.getResources = async (req, res) => {
    try {
        const { subject, semester, type, search, sort = 'newest', page = 1 } = req.query;
        let query = { status: 'approved' };

        if (subject && subject !== 'All') query.subject = subject;
        if (semester && semester !== 'All') query.semester = parseInt(semester);
        if (type && type !== 'All') query.type = type;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'most_liked') sortOption = { 'likes.length': -1, createdAt: -1 };
        if (sort === 'most_downloaded') sortOption = { downloads: -1, createdAt: -1 };

        const limit = 12;
        const totalItems = await Resource.countDocuments(query);
        const pagination = getPagination(page, limit, totalItems);

        const resources = await Resource.find(query)
            .sort(sortOption)
            .skip(pagination.skip)
            .limit(limit)
            .populate('uploadedBy', 'name department');

        res.render('resources/index', {
            title: 'Study Hub & Resources - Campus Connect',
            resources,
            pagination,
            currentSubject: subject || 'All',
            currentSemester: semester || 'All',
            currentType: type || 'All',
            currentSearch: search || '',
            currentSort: sort
        });
    } catch (err) {
        console.error('getResources Error:', err);
        req.flash('error_msg', 'Could not load study resources.');
        res.redirect('/dashboard');
    }
};

exports.getUpload = (req, res) => {
    res.render('resources/upload', { title: 'Upload Resource - Campus Connect' });
};

exports.postUpload = async (req, res) => {
    try {
        const { title, description, subject, semester, type, linkUrl } = req.body;
        let filePath = '';
        let originalName = '';
        let size = 0;

        if (req.file) {
            filePath = '/uploads/resources/' + req.file.filename;
            originalName = req.file.originalname;
            size = req.file.size;
        }

        await Resource.create({
            title,
            description,
            subject,
            semester: parseInt(semester) || 1,
            type,
            filePath,
            linkUrl: type === 'link' ? linkUrl : '',
            originalName,
            size,
            uploadedBy: req.session.user._id,
            status: 'pending'
        });

        req.flash('success_msg', 'Resource uploaded successfully! It is currently pending administrator approval before being publicly visible.');
        res.redirect('/resources');
    } catch (err) {
        console.error('postUpload Error:', err);
        req.flash('error_msg', 'Resource upload failed. Please try again.');
        res.redirect('/resources/upload');
    }
};

exports.downloadResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { $inc: { downloads: 1 } },
            { new: true }
        );

        if (!resource) {
            req.flash('error_msg', 'Resource file not found.');
            return res.redirect('/resources');
        }

        if (resource.linkUrl) {
            return res.redirect(resource.linkUrl);
        }

        if (resource.filePath) {
            const absolutePath = path.join(__dirname, '..', 'public', resource.filePath);
            return res.download(absolutePath, resource.originalName || 'download');
        }

        req.flash('error_msg', 'No valid file download path found.');
        res.redirect('/resources');
    } catch (err) {
        console.error('downloadResource Error:', err);
        req.flash('error_msg', 'Error downloading resource.');
        res.redirect('/resources');
    }
};
