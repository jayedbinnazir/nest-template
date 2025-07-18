# Soft Delete Exclusion System

This document explains how soft deleted records are automatically excluded from all queries in the AppUser service.

## 🔄 **How TypeORM Soft Delete Works**

### **Automatic Exclusion**
When you have a `@DeleteDateColumn` in your entity, TypeORM automatically excludes soft deleted records from all queries unless you explicitly include them.

```typescript
@Entity('app_user')
export class AppUser {
  // ... other fields

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
    name: 'deleted_at',
  })
  deleted_at: Date | null;
}
```

## ✅ **Updated Query Methods**

### **1. findByEmail()**
```typescript
async findByEmail(email: string): Promise<AppUser | null> {
  // This will automatically exclude soft deleted records
  return await this.appUserRepository.findOne({ 
    where: { email } 
  });
}
```

### **2. findOne()**
```typescript
async findOne(email: string): Promise<AppUser> {
  // This will automatically exclude soft deleted records
  const user = await this.appUserRepository.findOne({ 
    where: { email } 
  });
  // ...
}
```

### **3. findById()**
```typescript
async findById(id: string): Promise<AppUser> {
  // This will automatically exclude soft deleted records
  const user = await this.appUserRepository.findOne({ 
    where: { id } 
  });
  // ...
}
```

### **4. findAll()**
```typescript
async findAll(): Promise<AppUser[]> {
  // This will automatically exclude soft deleted records
  const users = await this.appUserRepository.find();
  // ...
}
```

### **5. updateUser()**
```typescript
async updateUser(updateAuthDto: UpdateAuthDto, email: string): Promise<AppUser> {
  // This will automatically exclude soft deleted records
  const user = await this.appUserRepository.findOne({ 
    where: { email: email } 
  });
  // ...
}
```

## 🔍 **Methods That Include Deleted Records**

### **1. findAllWithDeleted()**
```typescript
async findAllWithDeleted(): Promise<AppUser[]> {
  const users = await this.appUserRepository.find({
    withDeleted: true, // Explicitly include deleted records
  });
  // ...
}
```

### **2. findDeleted()**
```typescript
async findDeleted(): Promise<AppUser[]> {
  const users = await this.appUserRepository.find({
    where: { deleted_at: Not(IsNull()) },
    withDeleted: true, // Required to find deleted records
  });
  // ...
}
```

### **3. Soft Delete Operations**
```typescript
async softDelete(id: string) {
  // Find user before deletion (excludes deleted)
  const user = await this.findById(id);
  
  await this.appUserRepository.softDelete(id);
  
  // Find user after deletion (includes deleted)
  const deletedUser = await this.appUserRepository.findOne({
    where: { id },
    withDeleted: true,
  });
  // ...
}
```

### **4. Restore Operations**
```typescript
async restore(id: string) {
  // Find user including deleted ones
  const user = await this.appUserRepository.findOne({
    where: { id },
    withDeleted: true, // Required to find deleted records
  });
  // ...
}
```

## 🛡️ **Security Benefits**

### **Authentication Protection**
- ✅ **Login attempts** from soft deleted users are automatically rejected
- ✅ **Registration** checks exclude soft deleted users from email uniqueness
- ✅ **Profile access** only works for active users
- ✅ **No data leakage** from deleted accounts

### **Data Integrity**
- ✅ **Consistent queries** - all normal operations exclude deleted records
- ✅ **No accidental access** to deleted user data
- ✅ **Clean API responses** - only active users are returned

## 🔄 **Query Behavior Examples**

### **Normal Query (Excludes Deleted)**
```typescript
// This query will NOT return soft deleted users
const activeUsers = await appUserRepository.find();
// Result: Only users where deleted_at IS NULL
```

### **Query with Deleted Records**
```typescript
// This query WILL return soft deleted users
const allUsers = await appUserRepository.find({
  withDeleted: true
});
// Result: All users including those where deleted_at IS NOT NULL
```

### **Query Only Deleted Records**
```typescript
// This query returns ONLY soft deleted users
const deletedUsers = await appUserRepository.find({
  where: { deleted_at: Not(IsNull()) },
  withDeleted: true
});
// Result: Only users where deleted_at IS NOT NULL
```

## 🎯 **Impact on Authentication**

### **Login Process**
```typescript
async validateUser(email: string, password: string): Promise<any> {
  // findByEmail() automatically excludes soft deleted users
  const user = await this.appUserService.findByEmail(email);
  if(!user){
    throw new UnauthorizedException('Invalid credentials');
  }
  // If user is soft deleted, they won't be found here
  // ...
}
```

### **Registration Process**
```typescript
async register(createAuthDto: CreateAuthDto) {
  // findByEmail() automatically excludes soft deleted users
  const existingUser = await this.appUserService.findByEmail(createAuthDto.email);
  if (existingUser) {
    throw new ConflictException('User with this email already exists');
  }
  // If a soft deleted user has this email, they won't be found
  // So registration will proceed normally
  // ...
}
```

## 🚨 **Important Notes**

### **Email Uniqueness**
- ✅ **Active users**: Email must be unique among active users
- ✅ **Soft deleted users**: Can have the same email as active users
- ✅ **Restore behavior**: If you restore a user with an email that exists in active users, it will fail

### **Best Practices**
1. **Always use normal queries** for business logic
2. **Use `withDeleted: true`** only when specifically needed
3. **Check for soft deleted status** before operations
4. **Handle email conflicts** during restore operations

### **Migration Considerations**
- ✅ **Existing queries** automatically benefit from soft delete exclusion
- ✅ **No code changes needed** for most existing functionality
- ✅ **Authentication remains secure** without additional configuration

This automatic exclusion ensures that soft deleted users cannot access the system or interfere with normal operations! 🎯 