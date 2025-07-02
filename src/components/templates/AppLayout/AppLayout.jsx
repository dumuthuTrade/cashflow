import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { useSidebar } from '../../../hooks/useSidebar';
import AppHeader from '../../organisms/AppHeader/AppHeader';
import AppSidebar from '../../organisms/AppSidebar/AppSidebar';
import Backdrop from '../../atoms/Backdrop';
import AuthContext from '../../../contexts/AuthProvider';
import { SidebarProvider } from '../../../contexts/SidebarContext.jsx';
import { defaultNavigationGroups, defaultUserDropdownItems } from '../../../config/navigationConfig';

const LayoutContent = () => {
  const { hasRole, user, logout } = useContext(AuthContext);
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (item) => {
  };

  const handleUserAction = (action) => {
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 xl:flex">
      <div>
        <AppSidebar
          user={user}
          navigationGroups={defaultNavigationGroups}
          userDropdownItems={defaultUserDropdownItems}
          brandTitle="CashFlow"
          brandIcon="💰"
          onNavigate={handleNavigate}
          onUserAction={handleUserAction}
          onLogout={handleLogout}
          hasRole={hasRole}
        />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader
          user={user}
          onLogout={handleLogout}
          onUserAction={handleUserAction}
          brandTitle="CashFlow"
          brandIcon="💰"
        />
        <main className="p-4 mx-auto max-w-7xl md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
