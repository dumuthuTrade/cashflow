import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const AuthGuard = ({ 
  children, 
  fallback = null, 
  requireAuth = true,
  requireRoles = [],
  requirePermissions = [] 
}) => {
  // Use individual selectors to avoid creating new objects on each render
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const hasRole = useAuthStore((state) => state.hasRole);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // Show loading while initializing - don't redirect during initialization
  if (!isInitialized) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show loading while processing auth requests
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only check authentication after initialization is complete
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requireRoles.length > 0) {
    const hasRequiredRole = requireRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/login" replace />;
    }
  }

  // Check permission requirements
  if (requirePermissions.length > 0) {
    const hasRequiredPermission = requirePermissions.some(permission => hasPermission(permission));
    if (!hasRequiredPermission) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};
