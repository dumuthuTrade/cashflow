import { useContext } from 'react';
import { SidebarContext } from '../contexts/SidebarContext.jsx';

/**
 * Custom hook to use sidebar context
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
