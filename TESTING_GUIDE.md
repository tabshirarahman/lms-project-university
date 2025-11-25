# API Testing Guide

## Quick Start

### 1. Seed the Database
Run this to populate the database with demo data:
\`\`\`bash
npx tsx scripts/seed-database.ts
\`\`\`

### 2. Login as Admin
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }' \
  -c cookies.txt
\`\`\`

### 3. Create a Department
\`\`\`bash
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Electronics",
    "code": "EC",
    "description": "Electronics Engineering"
  }'
\`\`\`

### 4. Create a Subject
\`\`\`bash
curl -X POST http://localhost:3000/api/subjects \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Digital Logic",
    "code": "DL101",
    "credit": 3,
    "departmentId": "<department_id>"
  }'
\`\`\`

### 5. Create a Student
\`\`\`bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "roll": "003",
    "registration": "REG003",
    "departmentId": "<department_id>",
    "subject": "EC",
    "batch": "2023",
    "session": "Spring 2024",
    "gender": "Male"
  }'
\`\`\`

### 6. Create a Result
\`\`\`bash
curl -X POST http://localhost:3000/api/results \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "studentId": "<student_id>",
    "examId": "<exam_id>",
    "subjects": [
      {
        "subjectId": "<subject_id>",
        "marks": 85,
        "grade": "A"
      }
    ]
  }'
\`\`\`

### 7. Logout
\`\`\`bash
curl -X POST http://localhost:3000/api/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt
\`\`\`

## Testing Authorization

### Unauthorized Access (No Session)
\`\`\`bash
curl -X GET http://localhost:3000/api/students
# Returns: 401 Unauthorized
\`\`\`

### Forbidden Access (Student trying admin action)
\`\`\`bash
# Login as student
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Student@123"
  }' \
  -c student_cookies.txt

# Try to create department
curl -X POST http://localhost:3000/api/departments \
  -H "Content-Type: application/json" \
  -b student_cookies.txt \
  -d '{"name": "New Dept", "code": "ND"}'
# Returns: 403 Forbidden
\`\`\`

## Success Response Examples

### Successful List Request
\`\`\`json
{
  "data": [
    {
      "_id": "...",
      "name": "Computer Science",
      "code": "CS",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
\`\`\`

### Successful Create Request
\`\`\`json
{
  "_id": "...",
  "name": "Computer Science",
  "code": "CS",
  "description": "...",
  "createdAt": "2024-01-15T10:30:00Z"
}
\`\`\`

## Validation Error Examples

### Missing Required Field
\`\`\`json
{
  "error": "Validation failed",
  "details": {
    "name": ["String must contain at least 1 character(s)"]
  }
}
\`\`\`

### Invalid Email Format
\`\`\`json
{
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email address"]
  }
}
\`\`\`

### Multiple Validation Errors
\`\`\`json
{
  "error": "Validation failed",
  "details": {
    "name": ["String must contain at least 2 character(s)"],
    "email": ["Invalid email address"],
    "password": ["String must contain at least 6 character(s)"]
  }
}
\`\`\`

## All CRUD Operations Working

✅ **CREATE** - POST endpoints with validation
✅ **READ** - GET endpoints with pagination/filtering
✅ **UPDATE** - PUT endpoints with auth
✅ **DELETE** - DELETE endpoints with auth
✅ **AUTHENTICATION** - Login/Register/Logout working
✅ **AUTHORIZATION** - Role-based access control
✅ **ERROR HANDLING** - Centralized error responses
✅ **VALIDATION** - Zod schema validation on all inputs
