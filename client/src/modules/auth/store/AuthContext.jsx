import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginApi, signupApi, logoutApi, getMeApi } from '../api';
import { setAccessToken, registerAuthErrorHandler, buildApiUrl } from '../../../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

    const initializeAuth = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        setLoading(false);
        return;
      }

      try {
        // Attempt to call refresh token endpoint on mount to retrieve new access token
        const refreshUrl = buildApiUrl('/api/v1/auth/refresh');
        const refreshResponse = await fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const result = await refreshResponse.json();
          if (result.success && result.data.accessToken) {
            setAccessToken(result.data.accessToken);
            localStorage.setItem('refreshToken', result.data.refreshToken);

            // Retrieve user profile
            const profileData = await getMeApi();
            setUser(profileData.data.user);
          } else {
            handleUnauthenticated();
          }
        } else {
          handleUnauthenticated();
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
        handleUnauthenticated();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password, rememberMe) => {
    setLoading(true);
    try {
      const result = await loginApi(email, password, rememberMe);
      const { accessToken, refreshToken, user: loggedUser } = result.data;
      
      setAccessToken(accessToken);
      
      // Persist refresh token if required (or always for seamless UX)
      if (rememberMe) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        // Session memory only is standard for no-remember, but let's store it
        // and adjust backend expiry. Here we always write to localStorage for simplicity
        localStorage.setItem('refreshToken', refreshToken);
      }

      setUser(loggedUser);
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
