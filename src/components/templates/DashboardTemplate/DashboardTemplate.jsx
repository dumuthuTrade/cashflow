import { useState } from 'react';
import Button from '../../atoms/Button';
import PropTypes from 'prop-types';

const DashboardTemplate = ({ 
  children, 
  user, 
  onLogout,
  sidebarContent,
  headerActions 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '#', icon: '📊', current: true },
    { name: 'Transactions', href: '#', icon: '💳', current: false },
    { name: 'Categories', href: '#', icon: '🏷️', current: false },
    { name: 'Reports', href: '#', icon: '📈', current: false },
    { name: 'Settings', href: '#', icon: '⚙️', current: false },
  ];

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center px-4 bg-blue-600">
            <div className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <span className="text-xl font-bold text-white">CashFlow Pro</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>

          {/* User section */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              size="small"
              className="w-full mt-3"
            >
              Sign Out
            </Button>
          </div>

          {/* Additional sidebar content */}
          {sidebarContent}
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <span className="text-2xl">☰</span>
          </button>

          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              {/* Search could go here */}
            </div>
            <div className="ml-4 flex items-center space-x-4">
              {headerActions}
              
              {/* Notifications */}
              <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="sr-only">View notifications</span>
                <span className="text-xl">🔔</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

DashboardTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
  sidebarContent: PropTypes.node,
  headerActions: PropTypes.node,
};

export default DashboardTemplate;
