# Learning Management System (LMS) with Next.js

A comprehensive, full-stack Learning Management System built with Next.js, MongoDB, and TypeScript. This platform enables institutions to manage students, departments, courses, exams, results, and gather feedback through surveys.

## Features

### For Administrators
- **Dashboard**: Real-time analytics with key metrics, survey statistics, and quick actions
- **Student Management**: Create, update, and manage student records with pagination and search
- **Department Management**: Organize courses and students by academic departments
- **Course Management**: Create and manage courses with subjects and prerequisites
- **Exam & Results**: Record exam results with automatic GPA calculation and pass/fail status
- **Survey Management**: Create surveys with multiple question types (MCQ, rating, text) and view detailed analytics
- **Result Search**: Advanced search functionality to find results by student, exam, or department

### For Students
- **Personal Dashboard**: View recent results, featured courses, and survey opportunities
- **Results Tracking**: Access all exam results with detailed subject breakdown and GPA information
- **Profile Management**: Update personal information and academic details
- **Course Browsing**: Discover and explore available courses
- **Survey Participation**: Provide feedback through institute surveys

### Public Features
- **Landing Page**: Marketing homepage with live satisfaction metrics from surveys
- **Course Listing**: Browse and explore all published courses
- **About & Contact**: Information pages with contact form
- **Public Surveys**: Anonymous survey participation for feedback collection

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod for schema validation
- **Forms**: react-hook-form with Zod integration
- **State Management**: SWR for client-side data fetching and caching
- **Authentication**: Session-based with HTTP-only cookies

## Project Structure

\`\`\`
├── app/
│   ├── admin/                 # Admin dashboard and management pages
│   ├── api/                   # API routes for all CRUD operations
│   ├── auth/                  # Authentication pages (login, register)
│   ├── student/               # Student dashboard and results
│   ├── courses/               # Public course pages
│   ├── contact/               # Contact page
│   ├── about/                 # About page
│   ├── surveys/               # Public survey page
│   └── page.tsx               # Landing page
├── components/
│   ├── admin/                 # Admin-specific components
│   ├── public/                # Public-facing components
│   ├── student/               # Student dashboard components
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── db/
│   │   ├── models/            # Mongoose models
│   │   └── mongoose.ts        # Database connection
│   ├── auth/                  # Authentication utilities
│   ├── types/                 # TypeScript type definitions
│   └── validations/           # Zod validation schemas
└── public/                    # Static assets
\`\`\`

## Database Schema

The system includes 13 MongoDB models:

- **User**: Base user model with authentication
- **Student**: Student profile with enrollment information
- **Department**: Academic departments
- **Subject**: Subjects offered in courses
- **Course**: Courses with multiple subjects
- **Exam**: Exam records with date and type
- **Result**: Student exam results with marks and GPA
- **Survey**: Survey templates with questions
- **SurveyQuestion**: Individual survey questions with types
- **SurveyResponse**: Student responses to surveys
- **Persona**: Role-based personas for stakeholders
- **Stakeholder**: Stakeholder management
- **Institute**: Institute information

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB instance
- npm or pnpm package manager

### Installation

1. **Clone and Install**
   \`\`\`bash
   git clone <repository-url>
   cd lms-project
   npm install
   \`\`\`

2. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Adjust `VERCEL_URL` for your deployment environment

3. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Students
- `GET /api/students` - List all students (paginated)
- `POST /api/students` - Create new student
- `GET /api/students/[id]` - Get student details
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Departments
- `GET /api/departments` - List all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/[id]` - Update department
- `DELETE /api/departments/[id]` - Delete department

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `GET /api/courses/[id]` - Get course details
- `PUT /api/courses/[id]` - Update course
- `DELETE /api/courses/[id]` - Delete course

### Subjects
- `GET /api/subjects` - List subjects
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/[id]` - Update subject
- `DELETE /api/subjects/[id]` - Delete subject

### Results
- `GET /api/results` - List all results (paginated)
- `POST /api/results` - Create result
- `GET /api/results/search` - Search results by student, exam, or department

### Surveys
- `GET /api/surveys` - List surveys
- `POST /api/surveys` - Create survey
- `PUT /api/surveys/[id]` - Update survey
- `DELETE /api/surveys/[id]` - Delete survey
- `GET /api/survey-stats` - Get survey statistics
- `POST /api/survey-responses` - Submit survey response

## Testing

### Demo Credentials

**Admin User**
- Email: `admin@lms.com`
- Password: `admin123`

**Student User**
- Email: `student@lms.com`
- Password: `student123`

These accounts are provided for testing purposes. You can create additional users through the registration page.

## Key Features Explained

### Session Management
The system uses HTTP-only cookies for secure session storage. Sessions are automatically set to expire after 7 days for security.

### Result Calculations
Results automatically calculate:
- Total marks from individual subject marks
- GPA (Grade Point Average) from marks
- Pass/fail status based on passing criteria

### Survey Analytics
The system aggregates survey responses and calculates:
- Total responses count
- Satisfaction percentage (from rating-type questions)
- Response breakdown by question

### Role-Based Access
- Admin users can access `/admin/*` routes with full management capabilities
- Students can access `/student/*` routes with personalized dashboards
- Public users can access landing page, courses, and surveys without authentication

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" and select your repository
   - Add environment variables in the Vercel dashboard
   - Click "Deploy"

3. **Set Environment Variables in Vercel**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: Set to `production`

### Deploy to Other Platforms

The project can also be deployed to:
- AWS (using Lambda or EC2)
- Google Cloud Platform
- Azure
- Self-hosted servers with Node.js

Just ensure MongoDB is accessible and environment variables are properly configured.

## Performance Optimizations

- SWR for efficient data fetching and caching
- Pagination on all list endpoints to manage large datasets
- Server-side rendering for SEO-friendly public pages
- Static assets optimized with Next.js Image component
- Database indexes on frequently queried fields

## Security Considerations

- Passwords are hashed using bcrypt
- Sessions stored in HTTP-only cookies (cannot be accessed by JavaScript)
- CSRF protection through same-site cookie policy
- Input validation using Zod schemas
- SQL injection protection through Mongoose parameterized queries
- CORS headers properly configured

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct in `.env.local`
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure database credentials are valid

### Authentication Issues
- Clear browser cookies and try logging in again
- Check browser console for specific error messages
- Verify user exists in database

### API Errors
- Check Next.js console for detailed error messages
- Verify all required fields are provided in POST/PUT requests
- Ensure user has appropriate role/permissions

## Contributing

This project is ready for customization and extension. Consider adding:
- File upload support (assignments, documents)
- Email notifications
- Payment integration for paid courses
- Advanced reporting and analytics
- Video content support
- Mobile app integration

## License

This project is built with Next.js and is free to use and modify.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Examine existing code examples
4. Create an issue in the repository

---

Built with Next.js, MongoDB, and ❤️
