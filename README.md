# Campus-Connect

Campus Connect is a full-stack student collaboration and campus information platform. It provides a centralized hub for students to access campus notices, upcoming events, study materials, and peer interaction, while offering administrators comprehensive content and user management capabilities.

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, Vanilla JavaScript
- **Templating:** EJS with partials
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose

## Prerequisites

- Node.js (v14 or higher recommended)
- MongoDB (running locally or a remote cluster)

## Setup and Installation

1. **Clone the repository (or navigate to the project folder):**
   ```bash
   cd "Campus Connect"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and update the values as needed.
   ```bash
   cp .env.example .env
   ```

   **Required `.env` Variables:**
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/campus_connect
   SESSION_SECRET=your_super_secret_session_key
   ADMIN_EMAIL=admin@campusconnect.edu
   ADMIN_PASSWORD=adminpassword123
   ```

## Seeding the Database

To populate the application with sample data (users, admin, notices, events, resources, posts), run the seed script before starting the server:

```bash
npm run seed
```

### Default Admin Login (created via seed)
- **Email:** `admin@campusconnect.edu` (or whatever is set in `.env`)
- **Password:** `adminpassword123` (or whatever is set in `.env`)

## Running the Application

**Development Mode** (with nodemon):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The application will be accessible at `http://localhost:3000`.

## Route Table

| Route | Method | Access | Description |
| --- | --- | --- | --- |
| `/` | GET | Public | Landing page |
| `/about` | GET | Public | About the platform |
| `/auth/login` | GET/POST | Guest | User login |
| `/auth/signup` | GET/POST | Guest | Student registration |
| `/auth/logout` | POST | Authenticated | User logout |
| `/dashboard` | GET | Student | Student dashboard overview |
| `/notices` | GET | Student | View all campus notices |
| `/notices/:id` | GET | Student | Notice details |
| `/events` | GET | Student | View upcoming & past events |
| `/events/:id` | GET | Student | Event details & RSVP |
| `/study-hub` | GET | Student | Browse uploaded study resources |
| `/study-hub/upload` | POST | Student | Upload a new resource |
| `/community` | GET | Student | Community posts and study groups |
| `/profile` | GET/POST | Authenticated | Manage user profile & settings |
| `/admin` | GET | Admin | Admin panel overview |
| `/admin/users` | GET/POST | Admin | Manage users (block/role change) |
| `/admin/notices` | GET/POST | Admin | Manage notices (CRUD) |
| `/admin/events` | GET/POST | Admin | Manage events (CRUD) |
| `/admin/resources` | GET/POST | Admin | Approve/Reject uploaded resources |

## Project Structure

- `models/`: Mongoose schemas.
- `controllers/`: Request handling logic.
- `routes/`: Express route definitions.
- `views/`: EJS templates and partials.
- `public/`: Static files (CSS, JS, images, uploads).
- `middleware/`: Authentication and error handling.

