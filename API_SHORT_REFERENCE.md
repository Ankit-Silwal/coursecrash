# CourseMatch API Quick Reference

## Auth Routes
- `POST /auth/login` - User login with email and password
- `POST /auth/register` - Register new user account
- `POST /auth/verify-otp` - Verify OTP sent to email during registration
- `POST /auth/resend-otp` - Resend OTP if not received
- `POST /auth/verify-resend-otp` - Verify resent OTP
- `POST /auth/forgot-password` - Request password reset OTP
- `POST /auth/verify-forgot-password` - Verify password reset OTP
- `POST /auth/change-forgot-password` - Reset password with verified OTP
- `POST /auth/change-password` - Change password for authenticated user
- `GET /auth/status` - Check login status and determine user role (admin/instructor/user)
- `POST /auth/logout` - Logout from current device
- `POST /auth/logout-all-devices` - Logout from all devices

## Admin Routes (checkAdmin middleware)
- `POST /admin/login` - Admin login
- `GET /admin/instructor-applications` - View all instructor applications
- `POST /admin/instructor-applications/:instructorId/approve` - Approve instructor application
- `POST /admin/instructor-applications/:instructorId/reject` - Reject instructor application
- `GET /admin/allusers` - List all users
- `GET /admin/allinstructors` - List all instructors
- `GET /admin/blocked-instructors` - List all blocked instructors
- `DELETE /admin/users/:userId` - Delete user account
- `POST /admin/instructors/:instructorId/block` - Block instructor account
- `POST /admin/instructors/:instructorId/unblock` - Unblock instructor account
- `POST /admin/courses/:courseId/block` - Block course
- `POST /admin/courses/:courseId/unblock` - Unblock course

## User Routes (checklogin middleware)
- `POST /user/apply-instructor` - Apply to become an instructor
- `POST /user/apply/:courseId/enroll` - Request enrollment in a course
- `GET /user/enrollments/approved` - Get your approved enrollments (with course info)
- `GET /user/courses` - Get all published courses
- `GET /user/courses/:courseId/lessons` - Get all lessons in a course (courseAccess required)
- `GET /user/lessons/:lessonId` - Get specific lesson details (courseAccess required)
- `POST /user/lessons/getlink` - Get download link for lesson content (courseAccess required)

## Instructor Routes (checkInstructor middleware)
### Courses
- `POST /instructor/courses` - Create new course
- `GET /instructor/courses` - Get all instructor's courses
- `DELETE /instructor/courses/:courseId` - Delete course
- `POST /instructor/courses/:courseId/publish` - Publish course to students
- `POST /instructor/courses/:courseId/unpublish` - Unpublish course from students

### Lessons
- `POST /instructor/courses/:courseId/lessons` - Create lesson in course
- `GET /instructor/courses/:courseId/lessons` - Get all lessons in course
- `DELETE /instructor/lessons/:lessonId` - Delete lesson

### File Management
- `POST /instructor/uploads/sign` - Get signed URL for file upload
- `POST /instructor/lessons/update-url` - Update lesson with file URL after upload

### Enrollments
- `GET /instructor/enrollments` - Get all enrollment requests for instructor's courses
- `GET /instructor/enrollments/:enrollmentId` - Get specific enrollment request details
- `POST /instructor/enrollments/:enrollmentId/accept` - Accept single enrollment request
- `POST /instructor/enrollments/:enrollmentId/reject` - Reject single enrollment request
- `POST /instructor/enrollments/accept-all` - Accept all pending enrollment requests
- `POST /instructor/enrollments/reject-all` - Reject all pending enrollment requests
- `POST /instructor/enrollments/:enrollmentId/approve` - Approve enrollment (legacy)
- `POST /instructor/enrollments/:enrollmentId/revoke` - Revoke enrollment (legacy)

## Middleware Summary
- `checklogin` - Validates user session (requireAuth)
- `checkInstructor` - Validates instructor role and session
- `checkAdmin` - Validates admin role and session
- `courseAccess` - Validates user has access to course (owner or approved enrollment)
