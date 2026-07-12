import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, signupApi, logoutApi, getMeApi } from '../api';
import { setAccessToken, registerAuthErrorHandler, buildApiUrl } from '../../../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Clears active tokens and state on authentication failure or logout
  const handleUnauthenticated = () => {
    setAccessToken('');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    // Register global auth error handler for token expiration
    registerAuthErrorHandler(handleUnauthenticated);
    
    const restoreSession = async () => {
      const token = localStorage.getItem('refreshToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const result = await getMeApi();
        if (result && result.success && result.data?.user) {
          setUser(result.data.user);
        } else {
          handleUnauthenticated();
        }
      } catch (err) {
        handleUnauthenticated();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const result = await loginApi(email, password, rememberMe);
      const { accessToken, refreshToken, user: loggedUser } = result.data;
      
      setAccessToken(accessToken);
      
      if (rememberMe) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.setItem('refreshToken', refreshToken);
      }

      setUser(loggedUser);
      navigate('/dashboard');
      return loggedUser;
    } catch (error) {
      handleUnauthenticated();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      const result = await signupApi(email, password);
      return result;
    } finally {
      setLoading(false);  
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (err) {
      console.error('Failed to clean up token on server during logout:', err);
    } finally {
      handleUnauthenticated();
      navigate('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
