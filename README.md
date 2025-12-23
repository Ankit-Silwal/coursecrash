# CourseMatch Backend API

Complete backend API for the CourseMatch learning management system built with Express, MongoDB, and Redis.

## Features

- 🔐 **Multi-role Authentication** (User, Instructor, Admin)
- 📚 **Course Management** - Create, publish, and manage courses
- 👥 **Student Enrollment** - Apply and manage course enrollments
- 👨‍🏫 **Instructor Management** - Application, approval, and blocking system
- 📝 **Lesson Management** - Create and organize course lessons
- 📧 **Email Verification** - OTP-based email verification
- 🔄 **Password Reset** - Secure password reset flow
- 🎬 **Media Uploads** - AWS S3 integration for video/file uploads
- 🔐 **Session Management** - Redis-based session storage
- ⚡ **Real-time Status** - Check authentication status across devices

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── utils/           # Helper functions
├── index.ts         # Entry point
└── types.ts         # TypeScript types
```

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

## API Documentation

Base URL: `http://localhost:[PORT]/api`

### Authentication Endpoints
- POST `/auth/login` - User login
- POST `/auth/register` - Register new user
- POST `/auth/verify-otp` - Verify email OTP
- POST `/auth/resend-otp` - Resend OTP
- POST `/auth/forgot-password` - Request password reset
- POST `/auth/verify-forgot-password` - Verify reset OTP
- POST `/auth/change-forgot-password` - Change password
- POST `/auth/change-password` - Change password (authenticated)
- GET `/auth/status` - Check login status
- POST `/auth/logout` - Logout current device
- POST `/auth/logout-all-devices` - Logout all devices

### Admin Endpoints
- POST `/admin/login` - Admin login
- GET `/admin/instructor-applications` - View applications
- POST `/admin/instructor-applications/:id/approve` - Approve instructor
- POST `/admin/instructor-applications/:id/reject` - Reject instructor
- GET `/admin/ausers` - List all users
- DELETE `/admin/users/:id` - Delete user
- POST `/admin/instructors/:id/block` - Block instructor
- POST `/admin/instructors/:id/unblock` - Unblock instructor

### User Endpoints
- POST `/user/apply-instructor` - Apply as instructor
- POST `/user/apply/:courseId/enroll` - Enroll in course
- GET `/user/courses` - Get published courses
- GET `/user/courses/:courseId/lessons` - Get course lessons
- GET `/user/lessons/:lessonId` - Get lesson content
- POST `/user/lessons/getlink` - Get download link

### Instructor Endpoints
- POST `/instructor/courses` - Create course
- GET `/instructor/courses` - Get instructor's courses
- DELETE `/instructor/courses/:id` - Delete course
- POST `/instructor/courses/:id/publish` - Publish course
- POST `/instructor/courses/:id/unpublish` - Unpublish course
- POST `/instructor/courses/:id/lessons` - Create lesson
- GET `/instructor/courses/:id/lessons` - Get course lessons
- DELETE `/instructor/lessons/:id` - Delete lesson
- POST `/instructor/uploads/sign` - Get S3 signed URL
- POST `/instructor/lessons/update-url` - Update lesson URL
- GET `/instructor/enrollments` - Get enrollment requests
- GET `/instructor/enrollments/:id` - Get specific enrollment
- POST `/instructor/enrollments/:id/accept` - Accept enrollment
- POST `/instructor/enrollments/:id/reject` - Reject enrollment
- POST `/instructor/enrollments/:id/approve` - Approve student

## Environment Variables

See `.env.example` for all required variables.

## Database Models

- **User** - User accounts (Student/Instructor/Admin)
- **Course** - Course information
- **Lesson** - Course lessons
- **Enrollment** - Student course enrollments
- **InstructorApplication** - Instructor applications
- **OTP** - One-time passwords
- **Session** - User sessions (Redis)

## Authentication

All protected endpoints require either:
- `sessionId` cookie
- `x-session-id` header
- `sessionId` query parameter

Sessions are stored in Redis with 24-hour TTL.

## Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "code": 400
}
```

## Development

```bash
# Watch TypeScript changes
npm run watch

# Development with nodemon
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT
