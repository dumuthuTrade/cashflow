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
  const store = useAuthStore();
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
    updateUser,
    hasRole: storeHasRole,
    hasPermission: storeHasPermission
  } = store;

  // Initialize authentication on app start
  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized, initializeAuth]);

  // Role-based access control helper
  const hasRole = (role) => {
    if (!user) return false;
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.includes(role);
    }
    if (user.role) {
      return user.role === role;
    }
    return false;
  };

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
    refreshToken,
    hasRole: storeHasRole || hasRole,
    hasPermission: storeHasPermission || (() => false)
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
