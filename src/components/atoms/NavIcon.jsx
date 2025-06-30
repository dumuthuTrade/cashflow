import PropTypes from 'prop-types';
import { clsx } from 'clsx';

/**
 * NavIcon - Atom Component
 * Icon wrapper for navigation items with consistent styling
 */
const NavIcon = ({ 
  icon: Icon, 
  className = '', 
  size = 'medium',
  color = 'inherit',
  ...props 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const colors = {
    inherit: 'text-inherit',
    current: 'text-current',
    primary: 'text-blue-600',
    secondary: 'text-gray-500',
    muted: 'text-gray-400'
  };

  const iconClasses = clsx(
    'flex-shrink-0',
    sizes[size],
    colors[color],
    className
  );

  return (
    <Icon 
      className={iconClasses} 
      aria-hidden="true"
      {...props} 
    />
  );
};

NavIcon.propTypes = {
  icon: PropTypes.elementType.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['inherit', 'current', 'primary', 'secondary', 'muted'])
};

export default NavIcon;
