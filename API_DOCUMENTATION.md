# CourseMatch Backend API Documentation

## Base URL
```
http://localhost:[PORT]/api
```

---

## Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/verify-otp` | Verify registration OTP | No |
| POST | `/auth/resend-otp` | Resend OTP | No |
| POST | `/auth/verify-resend-otp` | Verify resent OTP | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/verify-forgot-password` | Verify forgot password OTP | No |
| POST | `/auth/change-forgot-password` | Reset password | No |
| POST | `/auth/change-password` | Change password | Yes (sessionId) |

---

## Admin Endpoints

**All require admin authentication (sessionId cookie)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/login` | Admin login |
| GET | `/admin/instructor-applications` | View all instructor applications |
| POST | `/admin/instructor-applications/:instructorId/approve` | Approve instructor |
| POST | `/admin/instructor-applications/:instructorId/reject` | Reject instructor |
| GET | `/admin/ausers` | List all users |
| DELETE | `/admin/users/:userId` | Delete user |
| POST | `/admin/instructors/:instructorId/block` | Block instructor |
| POST | `/admin/instructors/:instructorId/unblock` | Unblock instructor |

---

## Request/Response Examples

### Login (Auth)
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "You are logged in",
  "User": {
    "username": "john_doe",
    "email": "user@example.com"
  }
}
```

### Register (Auth)
```
POST /auth/register
{
  "username": "john_doe",
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### Verify OTP (Auth)
```
POST /auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### Get All Instructor Applications (Admin)
```
GET /admin/instructor-applications

Response:
{
  "success": true,
  "data": {
    "applications": [
      {
        "userId": "693f5b73152068391a579003",
        "username": "john_instructor"
      }
    ]
  }
}
```

### Get All Users (Admin)
```
GET /admin/ausers

Response:
{
  "success": true,
  "data": {
    "users": [...],
    "count": 10
  }
}
```

### Approve Instructor (Admin)
```
POST /admin/instructor-applications/:instructorId/approve

Response:
{
  "success": true,
  "message": "Instructor was granted"
}
```

### Delete User (Admin)
```
DELETE /admin/users/:userId

Response:
{
  "success": true,
  "message": "User was deleted successfully"
}
```

---

## Error Responses

**Common Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized (session expired)
- `404` - Not Found
- `500` - Server Error

**Response Format:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Notes
- All sessions stored in Redis with TTL: 24 hours
- Passwords excluded from responses (except login)
- All IDs are MongoDB ObjectIds
- Timestamps in ISO 8601 format

