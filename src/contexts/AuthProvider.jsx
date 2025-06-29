import React, { createContext, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */
const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * Manages authentication state initialization and provides auth context
 */
export const AuthProvider = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    initializeAuth,
    login,
    register,
    logout,
    clearError,
    refreshToken,
    updateUser
  } = useAuthStore();

  // Initialize authentication on app start
  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  const contextValue = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,

    // Actions
    login,
    register,
    logout,
    clearError,
    updateUser,
    refreshToken
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
