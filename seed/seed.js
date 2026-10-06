require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Group = require('../models/Group');
const Notification = require('../models/Notification');
const ContactMessage = require('../models/ContactMessage');
const SiteSetting = require('../models/SiteSetting');
const Report = require('../models/Report');

async function seed() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_connect');
        console.log('Connected to MongoDB!');

        console.log('Clearing existing database collections...');
        await Promise.all([
            User.deleteMany({}),
            Notice.deleteMany({}),
            Event.deleteMany({}),
            Resource.deleteMany({}),
            Post.deleteMany({}),
            Comment.deleteMany({}),
            Group.deleteMany({}),
            Notification.deleteMany({}),
            ContactMessage.deleteMany({}),
            SiteSetting.deleteMany({}),
            Report.deleteMany({})
        ]);

        console.log('Creating Admin account...');
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'adminpassword123', 10);
        const admin = await User.create({
            name: 'System Administrator',
            email: (process.env.ADMIN_EMAIL || 'admin@campusconnect.edu').toLowerCase(),
            password: adminPassword,
            role: 'admin',
            department: 'Computer Science',
            course: 'Faculty',
            bio: 'Head administrator for Campus Connect portal.',
            isActive: true
        });

        console.log('Creating Student accounts...');
        const studentPassword = await bcrypt.hash('password123', 10);
        const studentData = [
            { name: 'Alex Johnson', email: 'alex@campusconnect.edu', course: 'B.Tech', department: 'Computer Science', year: 3, semester: 5 },
            { name: 'Sophia Chen', email: 'sophia@campusconnect.edu', course: 'B.Tech', department: 'Information Technology', year: 2, semester: 3 },
            { name: 'Liam Williams', email: 'liam@campusconnect.edu', course: 'MCA', department: 'Computer Science', year: 2, semester: 3 },
            { name: 'Emma Davis', email: 'emma@campusconnect.edu', course: 'B.Tech', department: 'Electronics', year: 4, semester: 7 },
            { name: 'Noah Miller', email: 'noah@campusconnect.edu', course: 'BCA', department: 'Computer Science', year: 1, semester: 1 },
            { name: 'Olivia Wilson', email: 'olivia@campusconnect.edu', course: 'M.Tech', department: 'Information Technology', year: 1, semester: 1 },
            { name: 'Ethan Taylor', email: 'ethan@campusconnect.edu', course: 'B.Tech', department: 'Mechanical', year: 3, semester: 5 },
            { name: 'Ava Anderson', email: 'ava@campusconnect.edu', course: 'MBA', department: 'Business Admin', year: 2, semester: 3 }
        ];

        const students = [];
        for (const s of studentData) {
            const user = await User.create({
                ...s,
                password: studentPassword,
                role: 'student',
                bio: `Hello! I am a student in ${s.department}.`,
                isActive: true
            });
            students.push(user);
        }

        console.log('Creating Study Groups...');
        const groupsData = [
            { name: 'Web Dev Wizards', description: 'Group for Full-Stack Node & Frontend enthusiasts', createdBy: students[0]._id },
            { name: 'AI & Data Science Hub', description: 'Discussing machine learning, Python, and data pipelines', createdBy: students[1]._id },
            { name: 'Competitive Programmers', description: 'LeetCode, Codeforces, and algorithm practice', createdBy: students[2]._id },
            { name: 'CyberSecurity Club', description: 'CTF challenges, ethical hacking, and network security', createdBy: students[3]._id },
            { name: 'Exam Prep & Notes', description: 'Collaborative note sharing and exam preparation', createdBy: students[4]._id }
        ];

        const groups = [];
        for (const g of groupsData) {
            const group = await Group.create({
                ...g,
                members: [g.createdBy, students[5]._id, students[6]._id]
            });
            groups.push(group);
        }

        console.log('Creating Campus Notices...');
        const categories = ['Exam', 'Academic', 'Event', 'General', 'Placement'];
        const noticeTitles = [
            'End Semester Examination Schedule Released',
            'Mid-Term Re-evaluation Applications Open',
            'Annual Tech Fest "Tech Pulse 2026" Announced',
            'Campus Wifi Maintenance Notice this Weekend',
            'Placement Drive: Google & Microsoft Hiring 2026',
            'Library Timing Extended for Exam Preparation',
            'Workshop on Cloud Computing & DevOps Next Tuesday',
            'Scholarship Forms Submission Deadline Approaching',
            'Sports Meet Registration Now Open for All Batches',
            'Hostel Fee Payment Reminder & Guidelines',
            'Guest Lecture on Quantum Computing Frontiers',
            'Internship Fair 2026 - Company List Released'
        ];

        const notices = [];
        for (let i = 0; i < noticeTitles.length; i++) {
            const isPinned = i === 0 || i === 4;
            const isUrgent = i === 0 || i === 1;
            const notice = await Notice.create({
                title: noticeTitles[i],
                description: `Official campus update: ${noticeTitles[i]}. Please check all instructions carefully and adhere to guidelines. Contact administration if you have questions.`,
                category: categories[i % categories.length],
                isPinned,
                isUrgent,
                deadline: i % 2 === 0 ? new Date(Date.now() + (i + 3) * 24 * 60 * 60 * 1000) : null,
                author: admin._id,
                views: Math.floor(Math.random() * 150) + 20
            });
            notices.push(notice);
        }

        console.log('Creating Campus Events...');
        const eventTitles = [
            'Hackathon 2026: Build for Campus',
            'AI & Robotics Workshop',
            'Annual Cultural Night & Concert',
            'Career Guidance & Resume Review',
            'Open Source Contribution Drive',
            'Inter-College Football Tournament',
            'Cloud Architecture Bootcamp',
            'Cybersecurity CTF Competition',
            'Entrepreneurship & Startup Pitch',
            'Alumni Meet & Networking Lunch'
        ];

        const events = [];
        for (let i = 0; i < eventTitles.length; i++) {
            const isPast = i >= 8;
            const eventDate = isPast 
                ? new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000)
                : new Date(Date.now() + (i + 1) * 4 * 24 * 60 * 60 * 1000);

            const event = await Event.create({
                title: eventTitles[i],
                description: `Join us for ${eventTitles[i]}. Interactive sessions, networking opportunities, and exciting prizes for top performers!`,
                category: i % 2 === 0 ? 'Workshop' : 'Cultural',
                date: eventDate,
                time: '10:00 AM - 04:00 PM',
                venue: `Auditorium Hall ${ (i % 3) + 1 }, Main Campus`,
                capacity: 50 + (i * 10),
                attendees: [students[0]._id, students[1]._id, students[2]._id],
                author: admin._id
            });
            events.push(event);
        }

        console.log('Creating Study Hub Resources...');
        const subjects = ['Computer Networks', 'Operating Systems', 'Data Structures', 'Database Systems', 'Software Engineering'];
        const types = ['pdf', 'ppt', 'note', 'link', 'image'];
        const statuses = ['approved', 'approved', 'approved', 'pending', 'rejected'];

        const resources = [];
        for (let i = 1; i <= 20; i++) {
            const status = statuses[(i - 1) % statuses.length];
            const resource = await Resource.create({
                title: `Complete Study Material ${i} - ${subjects[(i - 1) % subjects.length]}`,
                description: `Detailed chapter notes, exam cheat sheet, and past year questions for ${subjects[(i - 1) % subjects.length]}.`,
                subject: subjects[(i - 1) % subjects.length],
                semester: ((i - 1) % 6) + 1,
                type: types[(i - 1) % types.length],
                linkUrl: types[(i - 1) % types.length] === 'link' ? 'https://developer.mozilla.org' : '',
                filePath: types[(i - 1) % types.length] !== 'link' ? '/uploads/resources/sample-document.pdf' : '',
                originalName: `Notes_Semester_${((i - 1) % 6) + 1}.pdf`,
                size: 1024 * 500,
                uploadedBy: students[(i - 1) % students.length]._id,
                status,
                rejectionReason: status === 'rejected' ? 'File formatting issue' : '',
                likes: [students[0]._id, students[1]._id],
                downloads: Math.floor(Math.random() * 80) + 5
            });
            resources.push(resource);
        }

        console.log('Creating Community Posts & Comments...');
        const topics = ['Academics', 'Tech', 'Career', 'General', 'Projects'];
        for (let i = 1; i <= 15; i++) {
            const post = await Post.create({
                title: `Discussion Topic #${i}: Best practices for ${topics[(i - 1) % topics.length]}`,
                content: `What are your thoughts and experience regarding this topic? Share your tips and advice below so everyone can learn together!`,
                topic: topics[(i - 1) % topics.length],
                group: i % 3 === 0 ? groups[0]._id : null,
                author: students[(i - 1) % students.length]._id,
                likes: [students[0]._id, students[2]._id],
                commentCount: 2
            });

            const comment1 = await Comment.create({
                post: post._id,
                author: students[(i + 1) % students.length]._id,
                content: 'Great post! I completely agree with your point of view.'
            });

            await Comment.create({
                post: post._id,
                author: students[(i + 2) % students.length]._id,
                content: 'Thanks for sharing this, really helpful resources!',
                parent: comment1._id
            });
        }

        console.log('Creating Initial Notifications...');
        await Notification.create([
            {
                user: students[0]._id,
                type: 'notice',
                message: 'New urgent notice posted: End Semester Examination Schedule Released',
                link: `/notices/${notices[0]._id}`
            },
            {
                user: students[0]._id,
                type: 'event',
                message: 'Upcoming Event: Hackathon 2026 is happening soon!',
                link: `/events/${events[0]._id}`
            }
        ]);

        console.log('Creating Site Settings...');
        await SiteSetting.create({
            key: 'announcement',
            value: {
                enabled: true,
                text: 'Welcome to Campus Connect 2026! Mid-term exam timetables have been updated.',
                type: 'info'
            }
        });

        console.log('Creating Sample Contact Messages...');
        await ContactMessage.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            subject: 'Inquiry regarding campus portal access',
            message: 'Hello, how do I request admin access for faculty members?',
            isRead: false
        });

        console.log('\n========================================');
        console.log('Database Seeding Complete!');
        console.log(`- 1 Admin: ${admin.email}`);
        console.log(`- ${students.length} Students (e.g. ${students[0].email})`);
        console.log(`- ${notices.length} Notices`);
        console.log(`- ${events.length} Events`);
        console.log(`- ${resources.length} Resources`);
        console.log(`- ${groups.length} Study Groups`);
        console.log('========================================\n');

        process.exit(0);
    } catch (err) {
        console.error('Database Seed Error:', err);
        process.exit(1);
    }
}

seed();
