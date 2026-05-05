import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Etudiant Pages
import Dashboard from './pages/Dashboard';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEtudiants from './pages/admin/ManageEtudiants';
import ManageProfesseurs from './pages/admin/ManageProfesseurs';
import ManageExamens from './pages/admin/ManageExamens';
import ManageGroupes from './pages/admin/ManageGroupes';
import ManageAbsences from './pages/admin/ManageAbsences';
import ManageSoumissions from './pages/admin/ManageSoumissions';

// Professeur Pages
import ProfesseurDashboard from './pages/professeur/ProfesseurDashboard';
import ProfesseurExamens from './pages/professeur/ProfesseurExamens';
import ProfesseurNotes from './pages/professeur/ProfesseurNotes';

// Smart redirect based on role
const RoleRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case 'ADMIN': return <Navigate to="/admin" />;
    case 'PROFESSEUR': return <Navigate to="/professeur" />;
    case 'ETUDIANT': return <Navigate to="/exams" />;
    default: return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/etudiants" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageEtudiants />
                </ProtectedRoute>
              } />
              <Route path="/admin/professeurs" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageProfesseurs />
                </ProtectedRoute>
              } />
              <Route path="/admin/examens" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageExamens />
                </ProtectedRoute>
              } />
              <Route path="/admin/groupes" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageGroupes />
                </ProtectedRoute>
              } />
              <Route path="/admin/absences" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageAbsences />
                </ProtectedRoute>
              } />
              <Route path="/admin/soumissions" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageSoumissions />
                </ProtectedRoute>
              } />

              {/* Professeur Routes */}
              <Route path="/professeur" element={
                <ProtectedRoute allowedRoles={['PROFESSEUR']}>
                  <ProfesseurDashboard />
                </ProtectedRoute>
              } />
              <Route path="/professeur/examens" element={
                <ProtectedRoute allowedRoles={['PROFESSEUR']}>
                  <ProfesseurExamens />
                </ProtectedRoute>
              } />
              <Route path="/professeur/notes" element={
                <ProtectedRoute allowedRoles={['PROFESSEUR']}>
                  <ProfesseurNotes />
                </ProtectedRoute>
              } />

              {/* Etudiant Routes */}
              <Route path="/exams" element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/exam/:id" element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <ExamPage />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute allowedRoles={['ETUDIANT']}>
                  <ResultPage />
                </ProtectedRoute>
              } />

              {/* Smart redirect */}
              <Route path="/" element={<RoleRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
