import PropTypes from 'prop-types';
import { useSidebar } from '../../hooks/useSidebar';

const Backdrop = ({ onClick, className = '' }) => {
  const { isMobileOpen, closeMobile } = useSidebar();

  // If onClick is provided, use it (for modal backdrop)
  if (onClick) {
    return (
      <div
        className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-75 ${className}`}
        onClick={onClick}
        aria-hidden="true"
      />
    );
  }

  // Otherwise, use sidebar functionality
  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
      onClick={closeMobile}
      aria-hidden="true"
    />
  );
};

Backdrop.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Backdrop;
