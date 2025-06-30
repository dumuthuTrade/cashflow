import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';

import NavGroup from '../../molecules/NavGroup/NavGroup';
import UserProfile from '../../molecules/UserProfile/UserProfile';
import { useSidebar } from '../../../hooks/useSidebar';
import { defaultNavigationGroups, defaultUserDropdownItems } from '../../../config/navigationConfig';

/**
 * AppSidebar - Collapsible sidebar with hover effects
 */
const AppSidebar = ({ 
  user,
  navigationGroups = defaultNavigationGroups,
  userDropdownItems = defaultUserDropdownItems,
  className = '',
  onNavigate,
  onUserAction,
  onLogout,
  hasRole,
  brandTitle = 'CashFlow Pro',
  brandIcon = '💰',
  ...props 
}) => {
  const location = useLocation();
  const {
    isExpanded,
    isHovered,
    isMobileOpen,
    setHovered,
    closeMobile
  } = useSidebar();

  // Filter navigation items based on user roles
  const filterItemsByRole = useCallback((items) => {
    if (!hasRole) return items;
    
    return items.filter(item => {
      if (!item.requiresRole) return true;
      return item.requiresRole.some(role => hasRole(role));
    });
  }, [hasRole]);

  const filteredNavigationGroups = navigationGroups.map(group => ({
    ...group,
    items: filterItemsByRole(group.items)
  })).filter(group => group.items.length > 0);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobile();
  }, [location.pathname, closeMobile]);

  const handleNavigate = useCallback((item, event) => {
    onNavigate?.(item, event);
    closeMobile();
  }, [onNavigate, closeMobile]);

  const handleUserAction = useCallback((item, event) => {
    onUserAction?.(item, event);
    if (item.id === 'logout') {
      onLogout?.(event);
    }
  }, [onUserAction, onLogout]);

  const sidebarClasses = clsx(
    'fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out',
    // Width based on state
    {
      'w-[290px]': isExpanded || isHovered || isMobileOpen,
      'w-[90px]': !isExpanded && !isHovered && !isMobileOpen,
    },
    // Mobile visibility
    {
      'translate-x-0': isMobileOpen,
      '-translate-x-full lg:translate-x-0': !isMobileOpen,
    },
    className
  );

  return (
    <div
      data-sidebar="true"
      className={sidebarClasses}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {/* Brand/Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center min-w-0">
          <div className="flex-shrink-0 text-2xl">
            {brandIcon}
          </div>
          <div 
            className={clsx(
              'ml-3 transition-all duration-300 ease-in-out',
              {
                'opacity-100 translate-x-0': isExpanded || isHovered || isMobileOpen,
                'opacity-0 -translate-x-2 lg:opacity-0 lg:-translate-x-2': !isExpanded && !isHovered && !isMobileOpen,
              }
            )}
          >
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {brandTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {filteredNavigationGroups.map((group) => (
            <NavGroup
              key={group.id}
              group={group}
              currentPath={location.pathname}
              onNavigate={handleNavigate}
              isCollapsed={!isExpanded && !isHovered && !isMobileOpen}
              showLabels={isExpanded || isHovered || isMobileOpen}
            />
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      {user && (
        <div className="border-t border-gray-200 dark:border-gray-800">
          <UserProfile
            user={user}
            dropdownItems={userDropdownItems}
            onDropdownItemClick={handleUserAction}
            showDropdown={isExpanded || isHovered || isMobileOpen}
            className={clsx(
              'transition-all duration-300 ease-in-out',
              {
                'px-4 py-4': isExpanded || isHovered || isMobileOpen,
                'px-2 py-4': !isExpanded && !isHovered && !isMobileOpen,
              }
            )}
          />
        </div>
      )}
    </div>
  );
};

AppSidebar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  navigationGroups: PropTypes.arrayOf(PropTypes.object),
  userDropdownItems: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  onNavigate: PropTypes.func,
  onUserAction: PropTypes.func,
  onLogout: PropTypes.func,
  hasRole: PropTypes.func,
  brandTitle: PropTypes.string,
  brandIcon: PropTypes.string
};

export default AppSidebar;
