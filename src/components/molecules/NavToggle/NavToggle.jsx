import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * NavToggle - Molecule Component
 * Toggle button for collapsing/expanding navigation
 */
const NavToggle = ({ 
  isOpen,
  onToggle,
  className = '',
  size = 'medium',
  variant = 'default',
  label = 'Toggle navigation',
  ...props 
}) => {
  const sizes = {
    small: 'p-1 w-8 h-8',
    medium: 'p-2 w-10 h-10',
    large: 'p-3 w-12 h-12'
  };

  const variants = {
    default: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700',
    primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900',
    white: 'text-white hover:text-gray-200 hover:bg-white/10'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const toggleClasses = clsx(
    'inline-flex items-center justify-center rounded-md transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    sizes[size],
    variants[variant],
    className
  );

  const Icon = isOpen ? XMarkIcon : Bars3Icon;

  return (
    <button
      type="button"
      className={toggleClasses}
      onClick={onToggle}
      aria-label={label}
      aria-expanded={isOpen}
      {...props}
    >
      <Icon 
        className={iconSizes[size]} 
        aria-hidden="true" 
      />
    </button>
  );
};

NavToggle.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'primary', 'white']),
  label: PropTypes.string
};

export default NavToggle;
