import PropTypes from 'prop-types';
import { clsx } from 'clsx';

/**
 * NavLabel - Atom Component
 * Text label for navigation items with consistent typography
 */
const NavLabel = ({ 
  children, 
  className = '', 
  size = 'medium',
  weight = 'medium',
  truncate = true,
  ...props 
}) => {
  const sizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const labelClasses = clsx(
    'text-inherit',
    sizes[size],
    weights[weight],
    truncate && 'truncate',
    className
  );

  return (
    <span 
      className={labelClasses}
      {...props}
    >
      {children}
    </span>
  );
};

NavLabel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  weight: PropTypes.oneOf(['normal', 'medium', 'semibold', 'bold']),
  truncate: PropTypes.bool
};

export default NavLabel;
