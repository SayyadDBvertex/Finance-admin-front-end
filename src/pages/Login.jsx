import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Prevent render while loading / already logged in
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

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      // 🔥 Replace this with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response
      const mockToken = `mock_token_${Date.now()}`;
      const mockUser = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'admin', // change to 'user' if needed
      };

      login({
        token: mockToken,
        user: mockUser,
      });

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
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
