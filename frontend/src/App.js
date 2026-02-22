import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import './styles/global.css';

// Public pages
import HomePage from './pages/HomePage';
import SubjectPage from './pages/SubjectPage';
import { SubjectsPage } from './pages/AdminSubjects';
import PracticePage from './pages/PracticePage';

// Admin pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuestions, { QuestionForm } from './pages/AdminQuestions';
import AdminPractice, { PracticeForm } from './pages/AdminPractice';
import AdminSubjects, { SubjectForm } from './pages/AdminSubjects';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: 'var(--green)', secondary: 'transparent' } },
            error: { iconTheme: { primary: 'var(--red)', secondary: 'transparent' } },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:code" element={<SubjectPage />} />
          <Route path="/practice" element={<PracticePage />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          <Route path="/admin/questions" element={<ProtectedRoute><AdminQuestions /></ProtectedRoute>} />
          <Route path="/admin/questions/new" element={<ProtectedRoute><QuestionForm /></ProtectedRoute>} />
          <Route path="/admin/questions/edit/:id" element={<ProtectedRoute><QuestionFormEdit /></ProtectedRoute>} />

          <Route path="/admin/practice" element={<ProtectedRoute><AdminPractice /></ProtectedRoute>} />
          <Route path="/admin/practice/new" element={<ProtectedRoute><PracticeForm /></ProtectedRoute>} />
          <Route path="/admin/practice/edit/:id" element={<ProtectedRoute><PracticeFormEdit /></ProtectedRoute>} />

          <Route path="/admin/subjects" element={<ProtectedRoute><AdminSubjects /></ProtectedRoute>} />
          <Route path="/admin/subjects/new" element={<ProtectedRoute><SubjectForm /></ProtectedRoute>} />
          <Route path="/admin/subjects/edit/:code" element={<ProtectedRoute><SubjectFormEdit /></ProtectedRoute>} />

          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

          {/* Redirect /admin to dashboard */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Edit wrappers (read ID from URL params)
function QuestionFormEdit() {
  const id = window.location.pathname.split('/').pop();
  return <QuestionForm editId={id} />;
}

function PracticeFormEdit() {
  const id = window.location.pathname.split('/').pop();
  return <PracticeForm editId={id} />;
}

function SubjectFormEdit() {
  const code = window.location.pathname.split('/').pop();
  return <SubjectForm editId={code} />;
}

export default App;
