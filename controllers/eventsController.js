const Event = require('../models/Event');
const generateICS = require('../utils/icsGenerator');

exports.getEvents = async (req, res) => {
    try {
        const { tab = 'upcoming', category, search } = req.query;
        let query = {};

        if (tab === 'upcoming') {
            query.date = { $gte: new Date() };
        } else if (tab === 'past') {
            query.date = { $lt: new Date() };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { venue: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(query)
            .sort({ date: tab === 'upcoming' ? 1 : -1 })
            .populate('author', 'name');

        res.render('events/index', {
            title: 'Campus Events - Campus Connect',
            events,
            currentTab: tab,
            currentCategory: category || 'All',
            currentSearch: search || ''
        });
    } catch (err) {
        console.error('getEvents Error:', err);
        req.flash('error_msg', 'Could not load events.');
        res.redirect('/dashboard');
    }
};

exports.getEventDetail = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('author', 'name email')
            .populate('attendees', 'name avatar department');

        if (!event) {
            req.flash('error_msg', 'Event not found.');
            return res.redirect('/events');
        }

        const isAttending = req.session.user ? event.attendees.some(a => a._id.toString() === req.session.user._id.toString()) : false;

        res.render('events/detail', {
            title: `${event.title} - Campus Connect`,
            event,
            isAttending
        });
    } catch (err) {
        console.error('getEventDetail Error:', err);
        req.flash('error_msg', 'Could not load event details.');
        res.redirect('/events');
    }
};

exports.downloadICS = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send('Event not found');

        const icsData = generateICS(event);
        res.setHeader('Content-Type', 'text/calendar');
        res.setHeader('Content-Disposition', `attachment; filename="event-${event._id}.ics"`);
        res.send(icsData);
    } catch (err) {
        res.status(500).send('Error generating ICS file');
    }
};
