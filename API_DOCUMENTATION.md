# LMS API Documentation

Complete reference for all API endpoints with authentication and authorization requirements.

## Authentication

All protected endpoints require a valid session cookie set during login.

### Login
**POST** `/api/auth/login`

Request body:
\`\`\`json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
\`\`\`

Response:
\`\`\`json
{
  "userId": "...",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin"
}
\`\`\`

### Register
**POST** `/api/auth/register`

Request body:
\`\`\`json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "Password@123",
  "role": "student"
}
\`\`\`

### Logout
**POST** `/api/auth/logout`

Clears the session cookie and logs out the user.

---

## Departments (Admin Only)

### List Departments
**GET** `/api/departments`

Response:
\`\`\`json
[
  {
    "_id": "...",
    "name": "Computer Science",
    "code": "CS",
    "description": "..."
  }
]
\`\`\`

### Create Department
**POST** `/api/departments` (Admin only)

Request body:
\`\`\`json
{
  "name": "Computer Science",
  "code": "CS",
  "description": "Computer Science Department"
}
\`\`\`

### Get Department
**GET** `/api/departments/:id`

### Update Department
**PUT** `/api/departments/:id` (Admin only)

### Delete Department
**DELETE** `/api/departments/:id` (Admin only)

---

## Subjects (Admin Only)

### List Subjects
**GET** `/api/subjects?departmentId=xxx&page=1&limit=10`

Supports filtering by department and pagination.

### Create Subject
**POST** `/api/subjects` (Admin only)

Request body:
\`\`\`json
{
  "name": "Data Structures",
  "code": "DS101",
  "credit": 3,
  "departmentId": "..."
}
\`\`\`

### Get Subject
**GET** `/api/subjects/:id`

### Update Subject
**PUT** `/api/subjects/:id` (Admin only)

### Delete Subject
**DELETE** `/api/subjects/:id` (Admin only)

---

## Courses (Admin Only for Create/Update/Delete)

### List Courses
**GET** `/api/courses?page=1&limit=10&status=published`

Supports pagination and filtering by status.

### Create Course
**POST** `/api/courses` (Admin only)

Request body:
\`\`\`json
{
  "title": "Web Development",
  "description": "Learn web development",
  "category": "Technology",
  "level": "Intermediate",
  "mode": "online",
  "price": 9999,
  "status": "published",
  "relatedSubjects": ["..."]
}
\`\`\`

### Get Course
**GET** `/api/courses/:id`

### Update Course
**PUT** `/api/courses/:id` (Admin only)

### Delete Course
**DELETE** `/api/courses/:id` (Admin only)

---

## Students (Admin Only)

### List Students
**GET** `/api/students?page=1&limit=10&search=xyz&departmentId=xxx` (Admin only)

Supports pagination, search, and filtering by department.

### Create Student
**POST** `/api/students` (Admin only)

Request body:
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "roll": "001",
  "registration": "REG001",
  "departmentId": "...",
  "subject": "CS",
  "batch": "2023",
  "session": "Spring 2023",
  "gender": "Male"
}
\`\`\`

Automatically creates associated user with password "Student@123".

### Get Student
**GET** `/api/students/:id`

### Update Student
**PUT** `/api/students/:id` (Admin only)

### Delete Student
**DELETE** `/api/students/:id` (Admin only)

---

## Results (Admin Only)

### List Results
**GET** `/api/results?page=1&limit=10&studentId=xxx` (Admin only)

Supports pagination and filtering by student.

### Create Result
**POST** `/api/results` (Admin only)

Request body:
\`\`\`json
{
  "studentId": "...",
  "examId": "...",
  "subjects": [
    {
      "subjectId": "...",
      "marks": 85,
      "grade": "A"
    }
  ]
}
\`\`\`

Automatically calculates total, GPA, and pass/fail status.

---

## Surveys (Public List, Admin Only for Create/Update/Delete)

### List Surveys
**GET** `/api/surveys?visibility=public`

Public surveys accessible to everyone.

### Create Survey
**POST** `/api/surveys` (Admin only)

Request body:
\`\`\`json
{
  "title": "Student Satisfaction Survey",
  "description": "Rate your experience",
  "targetGroup": "Students",
  "visibility": "public"
}
\`\`\`

### Get Survey
**GET** `/api/surveys/:id`

### Update Survey
**PUT** `/api/surveys/:id` (Admin only)

### Delete Survey
**DELETE** `/api/surveys/:id` (Admin only)

---

## Survey Questions (Admin Only)

### List Survey Questions
**GET** `/api/survey-questions?surveyId=xxx`

### Create Survey Question
**POST** `/api/survey-questions` (Admin only)

Request body:
\`\`\`json
{
  "type": "mcq",
  "questionText": "How satisfied are you?",
  "surveyId": "...",
  "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
}
\`\`\`

### Delete Survey Question
**DELETE** `/api/survey-questions/:id` (Admin only)

---

## Error Responses

All endpoints return consistent error responses:

**Validation Error (400):**
\`\`\`json
{
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email address"]
  }
}
\`\`\`

**Unauthorized (401):**
\`\`\`json
{
  "error": "Unauthorized: Please log in"
}
\`\`\`

**Forbidden (403):**
\`\`\`json
{
  "error": "Forbidden: This action requires admin role"
}
\`\`\`

**Not Found (404):**
\`\`\`json
{
  "error": "Student not found"
}
\`\`\`

**Server Error (500):**
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

---

## Demo Credentials

**Admin:**
- Email: `admin@example.com`
- Password: `Admin@123`

**Student:**
- Email: `student@example.com`
- Password: `Student@123`
