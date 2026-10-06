require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const morgan = require('morgan');
const compression = require('compression');

const connectDB = require('./config/db');
const { attachUser } = require('./middleware/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Route imports
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const noticesRoutes = require('./routes/notices');
const eventsRoutes = require('./routes/events');
const resourcesRoutes = require('./routes/resources');
const communityRoutes = require('./routes/community');
const groupsRoutes = require('./routes/groups');
const profileRoutes = require('./routes/profile');
const notificationsRoutes = require('./routes/notifications');
const searchRoutes = require('./routes/search');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
connectDB();

// Register Mongoose Models
require('./models/User');
require('./models/Notice');
require('./models/Event');
require('./models/Resource');
require('./models/Post');
require('./models/Comment');
require('./models/Group');
require('./models/Notification');
require('./models/Report');
require('./models/ContactMessage');
require('./models/SiteSetting');
require('./models/ActivityLog');

// Core Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// EJS View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'super_secret_campus_connect_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_connect' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));

// Flash messages
app.use(flash());

// Attach Global User & App Variables Middleware
app.use(attachUser);

// Mount Application Routes
app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/notices', noticesRoutes);
app.use('/events', eventsRoutes);
app.use('/resources', resourcesRoutes);
app.use('/community', communityRoutes);
app.use('/groups', groupsRoutes);
app.use('/profile', profileRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/search', searchRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(` Campus Connect Server running on http://localhost:${PORT}`);
    console.log(`==================================================\n`);
});
