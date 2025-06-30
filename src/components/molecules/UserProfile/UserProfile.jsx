import { useState } from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline';
import NavLabel from '../../atoms/NavLabel';

/**
 * UserProfile - Molecule Component
 * User info section in sidebar with dropdown functionality
 */
const UserProfile = ({ 
  user,
  className = '',
  showDropdown = true,
  dropdownItems = [],
  onDropdownItemClick,
  ...props 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const profileClasses = clsx(
    'p-4 border-t border-gray-200 dark:border-gray-700',
    className
  );

  const handleDropdownToggle = () => {
    if (showDropdown) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleDropdownItemClick = (item) => (event) => {
    event.stopPropagation();
    setIsDropdownOpen(false);
    onDropdownItemClick?.(item, event);
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.name || user?.email || 'User';
  const displayEmail = user?.email;
  const displayRole = user?.role || user?.roles?.[0];

  return (
    <div className={profileClasses} {...props}>
      <div 
        className={clsx(
          'flex items-center p-2 rounded-lg transition-colors duration-200',
          showDropdown && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
        )}
        onClick={handleDropdownToggle}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user?.avatar ? (
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user.avatar}
              alt={displayName}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              {user?.name ? (
                <span className="text-sm font-medium text-white">
                  {getInitials(user.name)}
                </span>
              ) : (
                <UserIcon className="h-5 w-5 text-white" />
              )}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="ml-3 flex-1 min-w-0">
          <NavLabel className="font-medium text-gray-900 dark:text-white" truncate>
            {displayName}
          </NavLabel>
          {displayEmail && displayEmail !== displayName && (
            <NavLabel 
              className="text-gray-500 dark:text-gray-400" 
              size="small" 
              weight="normal"
              truncate
            >
              {displayEmail}
            </NavLabel>
          )}
          {displayRole && (
            <NavLabel 
              className="text-blue-600 dark:text-blue-400" 
              size="small" 
              weight="medium"
              truncate
            >
              {displayRole}
            </NavLabel>
          )}
        </div>

        {/* Dropdown Arrow */}
        {showDropdown && dropdownItems.length > 0 && (
          <ChevronDownIcon 
            className={clsx(
              'h-4 w-4 text-gray-400 transition-transform duration-200',
              isDropdownOpen && 'transform rotate-180'
            )}
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {showDropdown && isDropdownOpen && dropdownItems.length > 0 && (
        <div className="mt-2 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {dropdownItems.map((item, index) => (
            <button
              key={item.id || `dropdown-item-${index}`}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={handleDropdownItemClick(item)}
              disabled={item.disabled}
            >
              {item.icon && (
                <item.icon className="h-4 w-4 mr-3 text-gray-400" />
              )}
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  className: PropTypes.string,
  showDropdown: PropTypes.bool,
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      disabled: PropTypes.bool
    })
  ),
  onDropdownItemClick: PropTypes.func
};

export default UserProfile;
