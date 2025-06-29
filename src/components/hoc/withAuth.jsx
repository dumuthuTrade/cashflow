import React from 'react';
import { useAuthStore } from '../../store/authStore';

/**
 * Higher Order Component for protected routes
 * Redirects to login if user is not authenticated
 */
export const withAuth = (WrappedComponent, options = {}) => {
  const { 
    redirectTo = '/login',
    requireRoles = [],
    requirePermissions = [],
    fallbackComponent: FallbackComponent = null
  } = options;

  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading, isInitialized, hasRole, hasPermission } = useAuthStore();

    // Show loading while initializing
    if (!isInitialized || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
      return null;
    }

    // Check role requirements
    if (requireRoles.length > 0) {
      const hasRequiredRole = requireRoles.some(role => hasRole(role));
      if (!hasRequiredRole) {
        return FallbackComponent ? (
          <FallbackComponent error="Insufficient permissions" />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        );
      }
    }

    // Check permission requirements
    if (requirePermissions.length > 0) {
      const hasRequiredPermission = requirePermissions.some(permission => hasPermission(permission));
      if (!hasRequiredPermission) {
        return FallbackComponent ? (
          <FallbackComponent error="Insufficient permissions" />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to perform this action.</p>
            </div>
          </div>
        );
      }
    }

    return <WrappedComponent {...props} />;
  };
};
