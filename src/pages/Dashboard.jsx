import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-2xl w-full bg-black/80 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-300">
          Welcome{user?.name ? `, ${user.name}` : ''}.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Role: {user?.role ?? 'user'}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
