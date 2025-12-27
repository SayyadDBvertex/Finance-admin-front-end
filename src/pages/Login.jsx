import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Loader screen
  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 🔥 REAL BACKEND LOGIN (ONLY DB USERS CAN LOGIN)
      const response = await API.post('/api/admin/login', {
        email,
        password,
      });

      const { data } = response.data;

      // Save auth data
      login({
        token: data.token,
        user: {
          id: data._id,
          role: data.role,
          email: data.email,
        },
      });

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);

      // Backend error message
      const message =
        err?.response?.data?.message || 'Invalid email or password';

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 px-4">
      <div className="w-full max-w-md rounded-3xl bg-black/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Xpenly</h1>
          <p className="text-sm text-gray-400 mt-1">Smart Money Management</p>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-1">Admin Login</h2>
        <p className="text-sm text-gray-400 mb-4">
          Enter your email and password
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="rounded-2xl px-4 py-3 bg-gray-800 focus-within:bg-gray-700 transition">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              disabled={isSubmitting}
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="rounded-2xl px-4 py-3 bg-gray-800 focus-within:bg-gray-700 transition">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              disabled={isSubmitting}
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 py-3 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          🔒 Secured Admin Access
        </p>
        <p className="text-[11px] text-center text-gray-500 mt-4">
          By continuing, you agree to our{' '}
          <span className="text-blue-400 cursor-pointer">Terms</span> and{' '}
          <span className="text-blue-400 cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
