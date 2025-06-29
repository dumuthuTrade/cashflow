import React from 'react';
import { useAuthStore } from '../../store/authStore';

/**
 * Route guard component for conditional rendering
 */
export const AuthGuard = ({ 
  children, 
  fallback = null, 
  requireAuth = true,
  requireRoles = [],
  requirePermissions = [] 
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    isInitialized, 
    hasRole, 
    hasPermission 
  } = useAuthStore();

  // Show loading while initializing
  if (!isInitialized || isLoading) {
    return fallback || (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return fallback || null;
  }

  // Check role requirements
  if (requireRoles.length > 0) {
    const hasRequiredRole = requireRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return fallback || null;
    }
  }

  // Check permission requirements
  if (requirePermissions.length > 0) {
    const hasRequiredPermission = requirePermissions.some(permission => hasPermission(permission));
    if (!hasRequiredPermission) {
      return fallback || null;
    }
  }

  return children;
};
