# Soft Delete, Restore, and Hard Delete System

This NestJS application implements a comprehensive user management system with soft delete, restore, and hard delete functionality using TypeORM's built-in soft delete features.

## 🔄 **Delete Types Overview**

### **1. Soft Delete**
- ✅ Sets `deleted_at` timestamp
- ✅ Keeps record in database
- ✅ Can be restored later
- ✅ Safe for data recovery

### **2. Restore**
- ✅ Removes `deleted_at` timestamp
- ✅ Makes user active again
- ✅ Preserves all original data

### **3. Hard Delete**
- ✅ Permanently removes record
- ✅ Cannot be recovered
- ✅ Use with extreme caution

## 🚀 **API Endpoints**

### **User Management**

#### **Get All Active Users**
```http
GET /api/app-user
Authorization: Bearer <token>
```

#### **Get All Users (Including Deleted)**
```http
GET /api/app-user/all-with-deleted
Authorization: Bearer <token>
```

#### **Get Only Deleted Users**
```http
GET /api/app-user/deleted
Authorization: Bearer <token>
```

#### **Get User by ID**
```http
GET /api/app-user/:id
Authorization: Bearer <token>
```

#### **Update User**
```http
PUT /api/app-user/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890",
  "address": "Updated Address"
}
```

### **Soft Delete Operations**

#### **Soft Delete Single User**
```http
DELETE /api/app-user/soft/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User soft deleted successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "deleted_at": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

#### **Restore Single User**
```http
POST /api/app-user/restore/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User restored successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "deleted_at": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

#### **Hard Delete Single User**
```http
DELETE /api/app-user/hard/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User permanently deleted",
  "deletedUser": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "deleted_at": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### **Bulk Operations**

#### **Soft Delete Multiple Users**
```http
DELETE /api/app-user/soft-many
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "message": "Users soft deleted successfully",
  "deletedCount": 3
}
```

#### **Restore Multiple Users**
```http
POST /api/app-user/restore-many
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "message": "Users restored successfully",
  "restoredCount": 3
}
```

#### **Hard Delete Multiple Users**
```http
DELETE /api/app-user/hard-many
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:**
```json
{
  "message": "Users permanently deleted",
  "deletedCount": 3
}
```

## 🛡️ **Security Features**

### **Authentication Required**
- ✅ All endpoints require JWT authentication
- ✅ Uses cookie-based authentication
- ✅ Protected with `JwtCookieGuard`

### **Validation**
- ✅ UUID validation for user IDs
- ✅ Input validation with class-validator
- ✅ Proper error handling

## 💻 **Frontend Integration**

### **JavaScript/TypeScript**
```javascript
// Soft delete a user
const softDeleteUser = async (userId) => {
  try {
    const response = await fetch(`/api/app-user/soft/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result.message); // "User soft deleted successfully"
    return result;
  } catch (error) {
    console.error('Soft delete failed:', error);
  }
};

// Restore a user
const restoreUser = async (userId) => {
  try {
    const response = await fetch(`/api/app-user/restore/${userId}`, {
      method: 'POST',
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result.message); // "User restored successfully"
    return result;
  } catch (error) {
    console.error('Restore failed:', error);
  }
};

// Hard delete a user (use with caution!)
const hardDeleteUser = async (userId) => {
  if (!confirm('Are you sure? This action cannot be undone!')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/app-user/hard/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const result = await response.json();
    console.log(result.message); // "User permanently deleted"
    return result;
  } catch (error) {
    console.error('Hard delete failed:', error);
  }
};

// Bulk operations
const softDeleteMany = async (userIds) => {
  try {
    const response = await fetch('/api/app-user/soft-many', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: userIds }),
      credentials: 'include',
    });
    const result = await response.json();
    console.log(`${result.deletedCount} users soft deleted`);
    return result;
  } catch (error) {
    console.error('Bulk soft delete failed:', error);
  }
};
```

### **React Example**
```jsx
import { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await fetch('/api/app-user', { credentials: 'include' });
    const data = await response.json();
    setUsers(data);
  };

  const fetchDeletedUsers = async () => {
    const response = await fetch('/api/app-user/deleted', { credentials: 'include' });
    const data = await response.json();
    setDeletedUsers(data);
  };

  const handleSoftDelete = async (userId) => {
    await softDeleteUser(userId);
    fetchUsers();
    fetchDeletedUsers();
  };

  const handleRestore = async (userId) => {
    await restoreUser(userId);
    fetchUsers();
    fetchDeletedUsers();
  };

  const handleHardDelete = async (userId) => {
    if (window.confirm('This will permanently delete the user. Continue?')) {
      await hardDeleteUser(userId);
      fetchDeletedUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDeletedUsers();
  }, []);

  return (
    <div>
      <h2>Active Users</h2>
      {users.map(user => (
        <div key={user.id}>
          <span>{user.name} ({user.email})</span>
          <button onClick={() => handleSoftDelete(user.id)}>Soft Delete</button>
        </div>
      ))}

      <h2>Deleted Users</h2>
      {deletedUsers.map(user => (
        <div key={user.id}>
          <span>{user.name} ({user.email}) - Deleted: {user.deleted_at}</span>
          <button onClick={() => handleRestore(user.id)}>Restore</button>
          <button onClick={() => handleHardDelete(user.id)}>Hard Delete</button>
        </div>
      ))}
    </div>
  );
};
```

## 🔧 **Database Schema**

The `app_user` table includes:

```sql
CREATE TABLE app_user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL -- Soft delete timestamp
);
```

## 🚨 **Important Notes**

### **Soft Delete Behavior**
- ✅ Records with `deleted_at` are excluded from normal queries
- ✅ Use `withDeleted: true` to include deleted records
- ✅ Email uniqueness is maintained even for deleted users
- ✅ Can be restored at any time

### **Hard Delete Behavior**
- ⚠️ **Permanent and irreversible**
- ⚠️ **Cannot be recovered**
- ⚠️ **Use only when absolutely necessary**
- ⚠️ **Consider data retention policies**

### **Best Practices**
1. **Use soft delete by default** for user management
2. **Implement confirmation dialogs** for hard delete
3. **Log all delete operations** for audit trails
4. **Set up automated cleanup** for old soft-deleted records
5. **Consider data retention policies** before hard delete

## 🧪 **Testing**

### **Using cURL**
```bash
# Get all users
curl -X GET http://localhost:3000/api/app-user \
  -H "Authorization: Bearer <token>"

# Soft delete a user
curl -X DELETE http://localhost:3000/api/app-user/soft/uuid \
  -H "Authorization: Bearer <token>"

# Restore a user
curl -X POST http://localhost:3000/api/app-user/restore/uuid \
  -H "Authorization: Bearer <token>"

# Hard delete a user
curl -X DELETE http://localhost:3000/api/app-user/hard/uuid \
  -H "Authorization: Bearer <token>"

# Bulk soft delete
curl -X DELETE http://localhost:3000/api/app-user/soft-many \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ids": ["uuid1", "uuid2"]}'
```

This comprehensive soft delete system provides safe user management with full recovery capabilities! 🎯 