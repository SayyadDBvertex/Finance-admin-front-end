import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole) {
    if (requiredRole === 'admin' && !isAdmin) {
      // User is authenticated but not an admin
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (user.role !== requiredRole) {
      // User doesn't have the required role
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // User is authenticated and has required role (if any)
  return children;
};

export default ProtectedRoute;
