# 🎓 EduVault — University CSE Department Exam Question Bank

A full-stack, production-ready web application for managing and serving university exam questions. Built for CSE Department, Semester 1 & 2.

---

## 📁 Complete Folder Structure

```
uni-exam-portal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT auth + adminOnly guard
│   │   ├── models/
│   │   │   ├── User.js              # Admin user schema
│   │   │   ├── Subject.js           # Subject schema
│   │   │   ├── Question.js          # Exam question schema
│   │   │   └── PracticeQuestion.js  # Practice/MCQ schema
│   │   ├── routes/
│   │   │   ├── auth.js              # POST /api/auth/login, GET /api/auth/me
│   │   │   ├── subjects.js          # CRUD for subjects
│   │   │   ├── questions.js         # CRUD + PDF upload
│   │   │   ├── practice.js          # Practice questions CRUD + quiz
│   │   │   └── stats.js             # Admin dashboard stats
│   │   ├── utils/
│   │   │   └── seed.js              # Database seed script
│   │   └── server.js                # Express app entry point
│   ├── uploads/
│   │   └── pdfs/                    # Uploaded PDF files (auto-created)
│   ├── .env.example                 # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── AdminLayout.js   # Admin page wrapper
    │   │   │   └── AdminSidebar.js  # Admin navigation sidebar
    │   │   └── shared/
    │   │       ├── Navbar.js        # Public navbar
    │   │       ├── QuestionCard.js  # Question display card
    │   │       ├── SubjectCard.js   # Subject display card
    │   │       └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js       # JWT auth state management
    │   ├── pages/
    │   │   ├── HomePage.js          # Landing page with search
    │   │   ├── SubjectPage.js       # Subject detail + questions
    │   │   ├── PracticePage.js      # Public practice mode
    │   │   ├── AdminLoginPage.js    # Secure admin login
    │   │   ├── AdminDashboard.js    # Stats + quick actions
    │   │   ├── AdminQuestions.js    # CRUD question management
    │   │   ├── AdminPractice.js     # CRUD practice questions
    │   │   ├── AdminSubjects.js     # CRUD subjects
    │   │   └── AdminSettings.js     # Password change
    │   ├── styles/
    │   │   └── global.css           # Design system CSS
    │   ├── utils/
    │   │   └── api.js               # Axios instance + API modules
    │   ├── App.js                   # Router + route config
    │   └── index.js
    └── package.json
```

---

## 🗄️ Database Schema Design

### Users Collection
```js
{
  _id: ObjectId,
  name: String,             // "Department Admin"
  email: String (unique),   // "admin@dept.edu"
  password: String,         // bcrypt hashed
  role: "admin",            // Only admin role supported
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### Subjects Collection
```js
{
  _id: ObjectId,
  name: String,             // "Data Structures & Algorithms"
  code: String (unique),    // "DSA"
  semester: 1 | 2,
  description: String,
  icon: String,             // "🌲"
  color: String,            // "#10b981"
  syllabus: [String],       // ["Arrays", "Linked Lists", ...]
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Questions Collection
```js
{
  _id: ObjectId,
  subject: ObjectId → Subject,
  examType: "CT1" | "CT2" | "CT3" | "FINAL",
  year: Number,             // 2024
  semester: 1 | 2,
  questionNumber: String,   // "Q1", "Q2(a)"
  questionText: String,
  marks: Number,
  tags: [String],
  difficulty: "easy" | "medium" | "hard",
  hasFormula: Boolean,
  formula: String,          // LaTeX string
  pdfFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: Date
  },
  isPublished: Boolean,
  viewCount: Number,
  createdBy: ObjectId → User,
  createdAt: Date,
  updatedAt: Date
}
```

### PracticeQuestions Collection
```js
{
  _id: ObjectId,
  subject: ObjectId → Subject,
  type: "MCQ" | "SHORT" | "LONG" | "PROBLEM",
  questionText: String,
  options: [{ label: "A", text: String }], // MCQ only
  correctAnswer: String,    // "B" for MCQ, model answer for others
  explanation: String,
  topic: String,            // "Binary Trees"
  difficulty: "easy" | "medium" | "hard",
  marks: Number,
  tags: [String],
  isAIGenerated: Boolean,   // Future: AI-generated questions
  isPublished: Boolean,
  attemptCount: Number,
  createdBy: ObjectId → User,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 Complete API Route Reference

### Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Admin login, returns JWT |
| GET | `/api/auth/me` | Admin | Get current admin info |
| POST | `/api/auth/change-password` | Admin | Change password |

### Subject Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/subjects` | Public | Get all subjects (filter: `?semester=1`) |
| GET | `/api/subjects/:code` | Public | Get subject by code (e.g., DSA) |
| POST | `/api/subjects` | Admin | Create subject |
| PUT | `/api/subjects/:id` | Admin | Update subject |
| DELETE | `/api/subjects/:id` | Admin | Deactivate subject |

### Question Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/questions` | Public | Get all questions (filter: `?subject=DSA&examType=CT1&year=2023`) |
| GET | `/api/questions/by-subject/:code` | Public | Questions grouped by exam type |
| GET | `/api/questions/:id` | Public | Get single question |
| POST | `/api/questions` | Admin | Create question (multipart/form-data for PDF) |
| PUT | `/api/questions/:id` | Admin | Update question |
| DELETE | `/api/questions/:id` | Admin | Delete question + PDF file |
| GET | `/api/questions/download/:id/pdf` | Public | Download PDF |

### Practice Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/practice` | Public | Get practice questions (filter: `?subject=DSA&type=MCQ`) |
| GET | `/api/practice/quiz/:subjectCode` | Public | Random quiz generator |
| GET | `/api/practice/:id/answer` | Public | Get answer (hidden in quiz) |
| POST | `/api/practice` | Admin | Create practice question |
| PUT | `/api/practice/:id` | Admin | Update practice question |
| DELETE | `/api/practice/:id` | Admin | Delete practice question |

### Stats Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/stats` | Admin | Dashboard stats |

---

## 🚀 Step-by-Step Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### Step 1: Clone & Configure Backend

```bash
cd uni-exam-portal/backend
npm install

# Copy env file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uni_exam_portal
# Or Atlas: mongodb+srv://username:password@cluster.mongodb.net/uni_exam_portal
JWT_SECRET=your_super_secret_random_key_at_least_32_characters
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@yourdept.edu
ADMIN_PASSWORD=YourSecurePassword123!
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

---

### Step 2: Seed the Database

```bash
npm run seed
```

This creates:
- ✅ Admin user (using your .env credentials)
- ✅ 5 subjects (DSA, OOP, EEE, MATH, PHYSICS)
- ✅ 16 sample exam questions
- ✅ 12 sample practice questions (MCQ + SHORT)

---

### Step 3: Start Backend

```bash
npm run dev   # Development with hot reload
# or
npm start     # Production
```

Backend runs at: `http://localhost:5000`

---

### Step 4: Configure & Start Frontend

```bash
cd ../frontend
npm install
```

Create `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

### Step 5: Login as Admin

1. Visit `http://localhost:3000/admin/login`
2. Use credentials from your `.env`:
   - Email: `admin@yourdept.edu`
   - Password: `YourSecurePassword123!`

---

## 🌐 Production Deployment

### Backend (e.g., Railway, Render, DigitalOcean)

```bash
# Set environment variables in your hosting platform
NODE_ENV=production
MONGODB_URI=your_atlas_uri
JWT_SECRET=strong_random_secret
ALLOWED_ORIGINS=https://your-frontend-domain.com

npm start
```

### Frontend (e.g., Vercel, Netlify)

```bash
# Set build environment variable
REACT_APP_API_URL=https://your-backend-api.com/api

npm run build
# Deploy the /build folder
```

### MongoDB Atlas (Recommended for production)
1. Create free cluster at https://cloud.mongodb.com
2. Get connection string
3. Set `MONGODB_URI` in backend env

---

## 🔒 Security Features

- **JWT Authentication** — Tokens expire in 7 days, stored in localStorage
- **Rate Limiting** — 200 req/15min globally, 10 req/15min for login
- **Helmet.js** — Security headers (XSS, CSRF protection)
- **Input Validation** — express-validator on auth routes
- **CORS** — Strict origin whitelist
- **Bcrypt** — Password hashing (cost factor 12)
- **Role Guards** — All admin routes protected with `protect + adminOnly` middleware
- **File Validation** — PDF uploads restricted by mimetype + 10MB limit

---

## 📈 Scalability Roadmap

The codebase is architected to support these future features:

### 1. Premium Model (Payments)
- Add `User` model for students (role: 'student' | 'premium')
- Add `Subscription` model
- Gate practice questions behind `isPremium` flag
- Integrate **Stripe** or **SSLCommerz** (Bangladesh)

### 2. AI-Generated MCQs
- `PracticeQuestion.isAIGenerated` field already present
- Add `/api/ai/generate` route using **Anthropic Claude API**
- Pass subject syllabus + existing questions as context
- Auto-populate practice question bank

### 3. Student Progress Tracking
- Track which questions students have attempted
- Add `Attempt` model: `{ userId, questionId, selectedAnswer, isCorrect, timestamp }`
- Build analytics dashboard

### 4. PDF Bulk Upload
- Upload full exam paper PDFs (already supported)
- Future: Parse PDFs with **pdf-parse** to auto-extract questions

### 5. Notification System
- Email new questions to registered students via **Nodemailer**
- Add semester-based question update alerts

---

## 🎨 UI/UX Design System

- **Font Display**: Syne (headings, titles)
- **Font Body**: Inter (text, UI)  
- **Font Code**: JetBrains Mono (question numbers, marks)
- **Theme**: Dark mode first, deep navy palette
- **Accent**: Indigo/Purple (#6366f1)
- **Each subject** has its own color theme (green for DSA, purple for OOP, etc.)

---

## 👤 Default Admin Credentials

After seeding:
- **Email**: Set in `.env` → `ADMIN_EMAIL`
- **Password**: Set in `.env` → `ADMIN_PASSWORD`
- **Default** (if not changed): `admin@dept.edu` / `Admin@123`

⚠️ **Change these before production deployment!**

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Custom CSS (design system variables) |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer (local storage) |
| Security | Helmet, express-rate-limit, CORS |
| Dev Tools | Nodemon, Morgan |

---

Built for scalability, security, and a great student experience. 🚀
