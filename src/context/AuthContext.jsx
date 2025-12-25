import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Safe JSON parse helper
const safeParse = (value) => {
  if (!value || typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (e) {
    return null;
  }
};

// Safe localStorage getter
const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

// Safe localStorage setter
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error(`Failed to set ${key} in localStorage:`, e);
    return false;
  }
};

// Safe localStorage remover
const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Failed to remove ${key} from localStorage:`, e);
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load auth from localStorage safely on mount
  useEffect(() => {
    let mounted = true;

    const initializeAuth = () => {
      try {
        const storedToken = safeGetItem('token');
        const storedUserRaw = safeGetItem('user');
        const storedUser = storedUserRaw ? safeParse(storedUserRaw) : null;

        if (mounted) {
          // Only set auth if both token and user are valid
          if (
            storedToken &&
            storedUser &&
            storedToken.trim() !== '' &&
            storedUser.id
          ) {
            setToken(storedToken);
            setUser(storedUser);
          } else {
            // Clean up invalid data
            if (storedToken || storedUserRaw) {
              safeRemoveItem('token');
              safeRemoveItem('user');
            }
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Error initializing auth from localStorage:', err);
        // Clean up on error
        safeRemoveItem('token');
        safeRemoveItem('user');
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Login function
  const login = ({ token: newToken, user: newUser }) => {
    if (!newToken || !newUser || !newUser.id) {
      console.error('Invalid login data: token and user with id are required');
      return false;
    }

    try {
      const tokenSaved = safeSetItem('token', newToken);
      const userSaved = safeSetItem('user', JSON.stringify(newUser));

      if (tokenSaved && userSaved) {
        setToken(newToken);
        setUser(newUser);
        return true;
      } else {
        // Clean up partial saves
        safeRemoveItem('token');
        safeRemoveItem('user');
        return false;
      }
    } catch (err) {
      console.error('Failed to save auth to localStorage:', err);
      safeRemoveItem('token');
      safeRemoveItem('user');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    safeRemoveItem('token');
    safeRemoveItem('user');
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = Boolean(token && user && user.id);

  // Check if user has admin role
  const isAdmin = isAuthenticated && user.role === 'admin';

  const value = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
