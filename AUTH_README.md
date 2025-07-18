# Authentication System Documentation

This NestJS application implements a complete authentication system with JWT tokens.

## Features

- User registration with password hashing
- User login with JWT token generation
- Protected routes using JWT authentication
- Password validation and security
- User profile endpoint

## API Endpoints

### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

### 2. Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### 3. Get User Profile (Protected Route)
```
GET /auth/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe"
}
```

## Environment Variables

Add the following to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
```

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens expire after 24 hours
- Email uniqueness is enforced at the database level
- Passwords are excluded from API responses
- Input validation using class-validator decorators

## Usage Examples

### Frontend Integration

```javascript
// Register a new user
const registerUser = async (userData) => {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// Login user
const loginUser = async (credentials) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};

// Access protected route
const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};
```

## Error Handling

The API returns appropriate HTTP status codes:

- `201` - User registered successfully
- `200` - Login successful
- `400` - Bad request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `409` - Conflict (email already exists)

## Database Schema

The authentication system uses the `app_user` table with the following structure:

- `id` (UUID, Primary Key)
- `name` (VARCHAR, Required)
- `email` (VARCHAR, Unique, Required)
- `password` (VARCHAR, Hashed, Required)
- `phone` (VARCHAR, Optional)
- `address` (VARCHAR, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `deleted_at` (TIMESTAMP, Soft Delete) 