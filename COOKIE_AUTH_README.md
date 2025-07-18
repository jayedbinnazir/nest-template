# Cookie-Based Authentication System

This NestJS application now supports both JWT token-based and cookie-based authentication for enhanced security.

## 🔐 **Security Benefits of Cookie-Based Auth**

- **XSS Protection**: `httpOnly` cookies prevent JavaScript access
- **CSRF Protection**: `sameSite: 'strict'` prevents cross-site requests
- **Automatic Token Management**: No need to manually handle tokens in frontend
- **Secure by Default**: HTTPS-only in production

## 🚀 **API Endpoints**

### **1. Register User (with Cookie)**
```http
POST /api/auth/register
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

**Cookie Set:**
```
Set-Cookie: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/
```

### **2. Login User (with Cookie)**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register
**Cookie Set:** Same as register

### **3. Logout (Clears Cookie)**
```http
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Cookie Cleared:**
```
Set-Cookie: access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
```

### **4. Get Profile (Header-based JWT)**
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### **5. Get Profile (Cookie-based JWT)**
```http
GET /api/auth/profile-cookie
```

**Response (both endpoints):**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe"
}
```

## 🍪 **Cookie Configuration**

```typescript
res.cookie('access_token', token, {
  httpOnly: true,        // Prevents XSS attacks
  secure: true,          // HTTPS only in production
  sameSite: 'strict',    // CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',             // Available across domain
});
```

## 🔄 **Authentication Strategies**

### **1. JwtStrategy (Header-based)**
- Extracts token from `Authorization: Bearer <token>` header
- Used with `@UseGuards(JwtAuthGuard)`

### **2. JwtCookieStrategy (Cookie-based)**
- Extracts token from `access_token` cookie
- Falls back to header if cookie not found
- Used with `@UseGuards(JwtCookieGuard)`

## 💻 **Frontend Integration**

### **Vanilla JavaScript**
```javascript
// Register user
const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include', // Important for cookies
  });
  return await response.json();
};

// Login user
const loginUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include', // Important for cookies
  });
  return await response.json();
};

// Access protected route (cookie-based)
const getProfile = async () => {
  const response = await fetch('/api/auth/profile-cookie', {
    credentials: 'include', // Important for cookies
  });
  return await response.json();
};

// Logout
const logout = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // Important for cookies
  });
  return await response.json();
};
```

### **React Example**
```jsx
import { useState, useEffect } from 'react';

const AuthComponent = () => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile-cookie', {
        credentials: 'include',
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Profile fetch failed:', error);
    }
  };

  useEffect(() => {
    getProfile(); // Check if user is already logged in
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <LoginForm onLogin={login} />
      )}
    </div>
  );
};
```

## 🔧 **Environment Variables**

```env
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production  # Enables secure cookies
```

## 🛡️ **Security Features**

### **Cookie Security**
- ✅ `httpOnly`: Prevents JavaScript access (XSS protection)
- ✅ `secure`: HTTPS only in production
- ✅ `sameSite: 'strict'`: CSRF protection
- ✅ `maxAge`: Automatic expiration (24 hours)
- ✅ `path: '/'`: Domain-wide access

### **Token Security**
- ✅ JWT tokens with 24-hour expiration
- ✅ Secure secret key validation
- ✅ Automatic token refresh on login/register

## 🔄 **Migration from Header-based to Cookie-based**

### **Before (Header-based)**
```javascript
// Store token manually
localStorage.setItem('token', response.access_token);

// Send token manually
fetch('/api/protected-route', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### **After (Cookie-based)**
```javascript
// No manual token storage needed
// Cookies are automatically sent with requests

fetch('/api/protected-route', {
  credentials: 'include' // Include cookies
});
```

## 🚨 **Important Notes**

1. **CORS Configuration**: Ensure your frontend domain is allowed
2. **HTTPS Required**: Secure cookies only work over HTTPS in production
3. **Same Domain**: Cookies work best when frontend and backend are on same domain
4. **Credentials**: Always include `credentials: 'include'` in fetch requests

## 🧪 **Testing**

### **Using cURL**
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Access protected route
curl -X GET http://localhost:3000/api/auth/profile-cookie \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

This cookie-based authentication system provides enhanced security while maintaining the flexibility of JWT tokens! 🎯 