import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers/ManageUsers';
import IncomeCategory from './pages/IcomeCategory/IcomeCategory';
import ExpenseCategory from './pages/ExpenseCategory/ExpenseCategory';
import AdminFaq from './pages/AdminFaq/AdminFaq';
import AdminFeedback from './pages/AdminFeedback/AdminFeedback';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* ================= ADMIN LAYOUT ================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Manage Users */}
        <Route path="admin/users" element={<ManageUsers />} />
        <Route path="/admin/income-category" element={<IncomeCategory />} />
        <Route path="/admin/expense-category" element={<ExpenseCategory />} />
        <Route path="/admin/faq" element={<AdminFaq />} />
        <Route path="/admin/feedback" element={<AdminFeedback />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
}

export default App;
