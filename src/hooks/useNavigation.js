import { useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthProvider';
import useNavigationStore from '../store/navigationStore';

/**
 * Custom hook for navigation functionality
 * Provides easy access to navigation state and actions
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useContext(AuthContext);
  const {
    isSidebarOpen,
    isMobileMenuOpen,
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    setSidebarOpen,
    setMobileMenuOpen
  } = useNavigationStore();

  // Navigate to a route and close mobile menu
  const navigateTo = useCallback((path) => {
    navigate(path);
    closeMobileMenu();
  }, [navigate, closeMobileMenu]);

  // Handle navigation item clicks
  const handleNavigationClick = useCallback((item) => {
    if (item.href) {
      navigateTo(item.href);
    }
    if (item.onClick) {
      item.onClick();
    }
  }, [navigateTo]);

  // Handle user dropdown actions
  const handleUserAction = useCallback((action) => {
    switch (action.id) {
      case 'profile':
        navigateTo('/profile');
        break;
      case 'settings':
        navigateTo('/settings');
        break;
      case 'logout':
        logout();
        break;
      default:
        if (action.onClick) {
          action.onClick();
        }
        break;
    }
  }, [navigateTo, logout]);

  // Check if current path is active
  const isActiveRoute = useCallback((itemPath, activePaths = []) => {
    if (location.pathname === itemPath) return true;
    return activePaths.some(path => location.pathname.startsWith(path));
  }, [location.pathname]);

  return {
    // Navigation state
    isSidebarOpen,
    isMobileMenuOpen,
    currentPath: location.pathname,
    user,
    hasRole,

    // Navigation actions
    navigateTo,
    toggleSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    setSidebarOpen,
    setMobileMenuOpen,
    handleNavigationClick,
    handleUserAction,
    isActiveRoute,
    logout
  };
};

export default useNavigation;
