import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import NavItem from '../../atoms/NavItem';

/**
 * NavGroup - Molecule Component
 * Grouped navigation items with optional title and divider
 */
const NavGroup = ({ 
  group,
  currentPath = '',
  onNavigate,
  isCollapsed = false,
  showLabels = true,
  className = '',
  ...props 
}) => {
  const groupClasses = clsx('space-y-1', className);

  const handleItemClick = (item) => (event) => {
    // Don't prevent default - let React Router Link handle navigation
    onNavigate?.(item, event);
  };

  return (
    <div className={groupClasses} {...props}>
      {group.title && showLabels && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            {group.title}
          </h3>
        </div>
      )}
      
      <nav className="space-y-1">
        {group.items.map((item, index) => {
          const isActive = currentPath === item.href || 
                          (item.activePaths && item.activePaths.includes(currentPath));
          
          return (
            <NavItem
              key={item.id || `nav-item-${index}`}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive}
              disabled={item.disabled}
              badge={item.badge}
              external={item.external}
              showLabel={showLabels}
              onClick={handleItemClick(item)}
            />
          );
        })}
      </nav>
    </div>
  );
};

NavGroup.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        href: PropTypes.string,
        icon: PropTypes.elementType,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        external: PropTypes.bool,
        activePaths: PropTypes.arrayOf(PropTypes.string)
      })
    )
  }).isRequired,
  currentPath: PropTypes.string,
  onNavigate: PropTypes.func,
  isCollapsed: PropTypes.bool,
  showLabels: PropTypes.bool,
  className: PropTypes.string
};

export default NavGroup;
