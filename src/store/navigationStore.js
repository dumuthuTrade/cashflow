import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Navigation Store
 * Manages navigation state including sidebar visibility and active routes
 */
const useNavigationStore = create(
  persist(
    (set) => ({
      // State
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      collapsedGroups: {},
      
      // Actions
      toggleSidebar: () => set(state => ({ 
        isSidebarOpen: !state.isSidebarOpen 
      })),
      
      setSidebarOpen: (isOpen) => set({ 
        isSidebarOpen: isOpen 
      }),
      
      toggleMobileMenu: () => set(state => ({ 
        isMobileMenuOpen: !state.isMobileMenuOpen 
      })),
      
      setMobileMenuOpen: (isOpen) => set({ 
        isMobileMenuOpen: isOpen 
      }),
      
      toggleGroup: (groupId) => set(state => ({
        collapsedGroups: {
          ...state.collapsedGroups,
          [groupId]: !state.collapsedGroups[groupId]
        }
      })),
      
      setGroupCollapsed: (groupId, isCollapsed) => set(state => ({
        collapsedGroups: {
          ...state.collapsedGroups,
          [groupId]: isCollapsed
        }
      })),
      
      closeMobileMenu: () => set({ 
        isMobileMenuOpen: false 
      }),
      
      // Reset all navigation state
      resetNavigation: () => set({
        isSidebarOpen: false,
        isMobileMenuOpen: false,
        collapsedGroups: {}
      })
    }),
    {
      name: 'navigation-storage',
      // Only persist specific state
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        collapsedGroups: state.collapsedGroups
      })
    }
  )
);

export default useNavigationStore;
