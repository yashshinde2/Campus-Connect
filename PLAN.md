# Implementation Plan: Campus Connect

## Overview
Campus Connect is a production-quality student collaboration and campus information platform built with Node.js, Express, MongoDB/Mongoose, EJS, and Bootstrap 5.3.

## Project Structure
```
d:\Campus Connect\
├── config/
│   ├── db.js
│   ├── multer.js
│   └── constants.js
├── controllers/
│   ├── authController.js
│   ├── mainController.js
│   ├── dashboardController.js
│   ├── noticesController.js
│   ├── eventsController.js
│   ├── resourcesController.js
│   ├── communityController.js
│   ├── groupsController.js
│   ├── profileController.js
│   ├── notificationsController.js
│   ├── searchController.js
│   ├── apiController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js
│   ├── upload.js
│   ├── validators.js
│   ├── errorHandler.js
│   └── rateLimiters.js
├── models/
│   ├── User.js
│   ├── Notice.js
│   ├── Event.js
│   ├── Resource.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Group.js
│   ├── Notification.js
│   ├── Report.js
│   ├── ContactMessage.js
│   ├── SiteSetting.js
│   └── ActivityLog.js
├── utils/
│   ├── pagination.js
│   ├── icsGenerator.js
│   ├── csvGenerator.js
│   ├── timeAgo.js
│   └── asyncHandler.js
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── animations.css
│   ├── js/
│   │   ├── main.js
│   │   └── modules/
│   │       ├── reveal.js
│   │       ├── counters.js
│   │       ├── tilt.js
│   │       ├── toast.js
│   │       ├── ripple.js
│   │       ├── charts.js
│   │       ├── calendar.js
│   │       ├── forms.js
│   │       └── search.js
│   ├── images/
│   └── uploads/
│       ├── avatars/
│       ├── resources/
│       ├── banners/
│       └── attachments/
├── routes/
│   ├── auth.js
│   ├── main.js
│   ├── dashboard.js
│   ├── notices.js
│   ├── events.js
│   ├── resources.js
│   ├── community.js
│   ├── groups.js
│   ├── profile.js
│   ├── notifications.js
│   ├── search.js
│   ├── api.js
│   └── admin.js
├── seed/
│   └── seed.js
├── views/
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── navbar.ejs
│   │   ├── sidebar.ejs
│   │   ├── footer.ejs
│   │   ├── flash.ejs
│   │   ├── pagination.ejs
│   │   ├── breadcrumbs.ejs
│   │   └── confirm-modal.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   ├── signup.ejs
│   │   ├── forgot.ejs
│   │   └── reset.ejs
│   ├── public/
│   │   ├── landing.ejs
│   │   ├── about.ejs
│   │   ├── contact.ejs
│   │   └── styleguide.ejs
│   ├── dashboard/
│   │   └── index.ejs
│   ├── notices/
│   │   ├── index.ejs
│   │   └── detail.ejs
│   ├── events/
│   │   ├── index.ejs
│   │   └── detail.ejs
│   ├── resources/
│   │   ├── index.ejs
│   │   └── upload.ejs
│   ├── community/
│   │   ├── index.ejs
│   │   ├── create.ejs
│   │   └── detail.ejs
│   ├── groups/
│   │   ├── index.ejs
│   │   └── detail.ejs
│   ├── profile/
│   │   ├── index.ejs
│   │   └── view.ejs
│   ├── notifications/
│   │   └── index.ejs
│   ├── search/
│   │   └── index.ejs
│   ├── admin/
│   │   ├── overview.ejs
│   │   ├── notices.ejs
│   │   ├── events.ejs
│   │   ├── users.ejs
│   │   ├── resources.ejs
│   │   ├── community.ejs
│   │   ├── groups.ejs
│   │   ├── messages.ejs
│   │   ├── settings.ejs
│   │   └── logs.ejs
│   └── errors/
│       ├── 404.ejs
│       └── 500.ejs
├── .env
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Route Table

| Path | Method | Auth | Description |
| --- | --- | --- | --- |
| `/` | GET | Public | Landing page |
| `/about` | GET | Public | About page |
| `/contact` | GET/POST | Public | Contact page & message submit |
| `/styleguide` | GET | Dev | Component library & design system preview |
| `/auth/login` | GET/POST | Guest | User login |
| `/auth/signup` | GET/POST | Guest | 3-step student registration |
| `/auth/forgot` | GET/POST | Guest | Forgot password token flow |
| `/auth/reset/:token` | GET/POST | Guest | Password reset page |
| `/auth/logout` | POST/GET | Auth | User logout |
| `/dashboard` | GET | Student | Dashboard overview |
| `/notices` | GET | Student | Notices listing with filters & search |
| `/notices/:id` | GET | Student | Notice detail view |
| `/events` | GET | Student | Events listing (upcoming/past & grid/calendar) |
| `/events/:id` | GET | Student | Event detail & attendee RSVP |
| `/events/:id/ics` | GET | Student | Download .ics calendar event |
| `/resources` | GET | Student | Study hub resources (approved) |
| `/resources/upload` | GET/POST | Student | Upload new study material |
| `/resources/:id/download` | GET | Student | Track download & serve file |
| `/community` | GET | Student | Feed of community posts |
| `/community/create` | GET/POST | Student | Create new post |
| `/community/:id` | GET/POST | Student | Post detail & add comments |
| `/groups` | GET/POST | Student | Study groups list & creation |
| `/groups/:id` | GET | Student | Group details & posts |
| `/profile` | GET/POST | Auth | Current user profile & updates |
| `/users/:id` | GET | Auth | View other user public profile |
| `/notifications` | GET | Auth | User notification center |
| `/search` | GET | Auth | Global search results page |
| `/api/search` | GET | Auth | AJAX search overlay suggestions |
| `/api/bookmark/:id` | POST | Auth | AJAX toggle bookmark |
| `/api/rsvp/:id` | POST | Auth | AJAX toggle RSVP |
| `/api/like/:type/:id` | POST | Auth | AJAX toggle like for resource/post/comment |
| `/api/group/:id/join` | POST | Auth | AJAX toggle group membership |
| `/api/notifications/read` | POST | Auth | AJAX mark notification(s) as read |
| `/admin` | GET | Admin | Admin overview dashboard |
| `/admin/notices` | GET/POST/PUT/DELETE | Admin | Manage notices CRUD |
| `/admin/events` | GET/POST/PUT/DELETE | Admin | Manage events CRUD |
| `/admin/users` | GET/POST/PUT/DELETE | Admin | User management (block/role/delete) |
| `/admin/resources` | GET/POST/DELETE | Admin | Resource moderation & approval |
| `/admin/community` | GET/DELETE | Admin | Posts & comments moderation |
| `/admin/groups` | GET/DELETE | Admin | Groups management |
| `/admin/messages` | GET/DELETE | Admin | Contact messages management |
| `/admin/settings` | GET/POST | Admin | Site announcement & configuration |
| `/admin/logs` | GET | Admin | Admin activity logs |
| `/admin/export/:type` | GET | Admin | CSV export (users, attendees) |

## Build Phases
1. Core Server setup, folder structure creation, database configuration, constants.
2. Complete Mongoose Data Models & comprehensive seed script.
3. Design system: `style.css`, `animations.css`, JS modules, partials, layout, `/styleguide` route.
4. Authentication, validation, password reset, session security, middlewares.
5. Public pages: landing (with rotating text & counters), about, contact, auth screens, 404 & 500 error pages.
6. Student dashboard & widgets (today on campus, mini calendar, quick stats, profile progress).
7. Notices & Events with AJAX bookmarking, RSVP, .ics export, category filters.
8. Study Hub: upload with Multer, drag & drop UI, admin approval queue, likes & downloads tracking.
9. Community feed, posts, threaded comments, likes, study groups join/leave.
10. Profile management, public profiles, global search overlay/page, notifications center with AJAX polling.
11. Full Admin Panel with interactive SVG charts, user blocking, content CRUD, moderation, CSV export, activity logging.
12. Final polish, performance tuning, responsive check, accessibility, verification.
