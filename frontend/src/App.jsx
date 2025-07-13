import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './features/auth/AuthContext';
import ProtectedRoute from './layout/ProtectedRoute';
import MainLayout from './layout/MainLayout';

// Auth pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateFolder from './pages/teacher/CreateFolder';
import PostMaterial from './pages/teacher/PostMaterial';
import EditMaterial from './pages/teacher/EditMaterial';
import MaterialView from './pages/MaterialView';
import FolderView from './pages/FolderView';
import Profile from './pages/Profile';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import TeachersList from './pages/student/TeachersList';

// Error pages
const Unauthorized = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h2>Unauthorized</h2>
    <p>You don't have permission to access this page.</p>
  </div>
);

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path='/' element={<Navigate to='/login'/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Shared protected routes */}
            <Route path="/material/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <MaterialView />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/folder/:id" element={
              <ProtectedRoute>
                <MainLayout>
                  <FolderView />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Protected Teacher routes */}
            <Route path="/teacher/*" element={
              <ProtectedRoute requiredRole="faculty">
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<TeacherDashboard />} />
                    <Route path="create-folder" element={<CreateFolder />} />
                    <Route path="post-material" element={<PostMaterial />} />
                    <Route path="edit-material/:id" element={<EditMaterial />} />
                    <Route path="uploads" element={<TeacherDashboard />} />
                    <Route path="*" element={<Navigate to="/teacher/dashboard" />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Protected Student routes */}
            <Route path="/student/*" element={
              <ProtectedRoute requiredRole="student">
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="*" element={<Navigate to="/student/dashboard" />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Default redirects */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/student/dashboard" />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;