import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import NavIcon from './NavIcon';
import NavLabel from './NavLabel';

/**
 * NavItem - Atom Component
 * Individual navigation link with icon and label
 */
const NavItem = forwardRef(({ 
  href,
  icon,
  label, 
  active = false,
  disabled = false,
  className = '',
  onClick,
  badge,
  external = false,
  showLabel = true,
  ...props 
}, ref) => {
  const baseClasses = clsx(
    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    'hover:bg-gray-50 dark:hover:bg-gray-700',
    {
      'bg-blue-50 border-r-4 border-blue-600 text-blue-700 dark:bg-blue-900 dark:text-blue-200': active,
      'text-gray-600 dark:text-gray-300': !active && !disabled,
      'text-gray-400 cursor-not-allowed': disabled,
      'cursor-pointer': !disabled,
      'justify-center': !showLabel
    },
    className
  );

  const iconClasses = clsx(
    'flex-shrink-0',
    {
      'mr-3': showLabel,
      'text-blue-600 dark:text-blue-400': active,
      'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400': !active && !disabled,
      'text-gray-300 dark:text-gray-600': disabled
    }
  );

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const content = (
    <>
      {icon && (
        <NavIcon 
          icon={icon} 
          className={iconClasses}
          size="medium" 
        />
      )}
      {showLabel && (
        <NavLabel className="flex-1">
          {label}
        </NavLabel>
      )}
      {badge && showLabel && (
        <span className="ml-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
          {badge}
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        className={baseClasses}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        ref={ref}
        to={href}
        className={baseClasses}
        onClick={handleClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
});

NavItem.displayName = 'NavItem';

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  external: PropTypes.bool,
  showLabel: PropTypes.bool
};

export default NavItem;
