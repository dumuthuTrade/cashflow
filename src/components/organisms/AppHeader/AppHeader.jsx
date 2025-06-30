import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import NavToggle from '../../molecules/NavToggle/NavToggle';
import UserProfile from '../../molecules/UserProfile/UserProfile';
import ThemeToggleButton from '../../atoms/ThemeToggleButton';
import { SidebarContext } from '../../../contexts/SidebarContext';

const AppHeader = ({ 
  user,
  headerActions,
  onUserAction,
  onLogout,
  showSearch = true,
  showNotifications = true,
  brandTitle,
  brandIcon,
  className = "",
  onMobileMenuToggle,
  isMobileMenuOpen = false,
  ...props 
}) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarContext = useContext(SidebarContext);
  const usingSidebarContext = !!sidebarContext;
  
  const toggleExpanded = usingSidebarContext ? sidebarContext.toggleExpanded : onMobileMenuToggle;
  const toggleMobile = usingSidebarContext ? sidebarContext.toggleMobile : onMobileMenuToggle;
  const isMobileOpen = usingSidebarContext ? sidebarContext.isMobileOpen : isMobileMenuOpen;

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search query:', searchQuery);
  };

  const handleNotificationClick = () => {
    // Handle notification click
    console.log('Notifications clicked');
  };

  return (
    <header 
      className={`sticky top-0 flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b shadow-sm ${className}`}
      {...props}
    >
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        {/* Top section with mobile menu toggle and brand */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Mobile menu toggle */}
          <div className="block lg:hidden">
            <NavToggle
              isOpen={isMobileOpen}
              onToggle={toggleMobile}
              variant="default"
              size="medium"
              label="Open navigation menu"
            />
          </div>

          {/* Desktop sidebar toggle */}
          <button
            onClick={toggleExpanded}
            className="items-center justify-center hidden w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="fill-current"
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Brand logo - Mobile only */}
          {brandTitle && (
            <div className="flex items-center lg:hidden">
              {brandIcon && (
                <img
                  className="w-8 h-8 mr-2"
                  src={brandIcon}
                  alt={`${brandTitle} logo`}
                />
              )}
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {brandTitle}
              </span>
            </div>
          )}

          {/* Mobile application menu toggle */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden transition-colors"
            aria-label="Toggle application menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Search bar - Desktop only */}
          {showSearch && (
            <div className="hidden lg:block">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <button 
                    type="submit"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search or type command..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-600 xl:w-[430px]"
                  />
                  <div className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <span>⌘</span>
                    <span>K</span>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Actions section */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex lg:justify-end lg:px-0 lg:py-0 shadow-sm lg:shadow-none border-t border-gray-200 dark:border-gray-800 lg:border-t-0`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle */}
            <ThemeToggleButton />

            {/* Custom header actions */}
            {headerActions}

            {/* Notifications */}
            {showNotifications && (
              <button
                type="button"
                onClick={handleNotificationClick}
                className="relative rounded-full bg-white dark:bg-gray-800 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                aria-label="View notifications"
              >
                <BellIcon className="h-6 w-6" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">3</span>
                </span>
              </button>
            )}
          </div>

          {/* User profile */}
          {user && (
            <UserProfile
              user={user}
              onUserAction={onUserAction}
              onLogout={onLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
};

AppHeader.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  headerActions: PropTypes.node,
  onUserAction: PropTypes.func,
  onLogout: PropTypes.func.isRequired,
  showSearch: PropTypes.bool,
  showNotifications: PropTypes.bool,
  brandTitle: PropTypes.string,
  brandIcon: PropTypes.string,
  className: PropTypes.string,
  // Legacy props for backward compatibility
  onMobileMenuToggle: PropTypes.func,
  isMobileMenuOpen: PropTypes.bool
};

AppHeader.defaultProps = {
  showSearch: true,
  showNotifications: true,
  className: ""
};

export default AppHeader;
