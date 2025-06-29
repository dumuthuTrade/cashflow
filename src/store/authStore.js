import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api/authService';
import { AuthError } from '../utils/errors';

/**
 * Enhanced Authentication Store with Zustand
 * Centralized state management for authentication
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialized: false,

      // Actions
      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        }),

      setToken: (token) => 
        set({ token }),

      setLoading: (isLoading) => 
        set({ isLoading }),

      setError: (error) => 
        set({ error }),

      clearError: () => 
        set({ error: null }),

      /**
       * Initialize authentication state
       */
      initializeAuth: async () => {
        set({ isLoading: true });
        
        try {
          const isValidToken = authService.initializeAuth();
          
          if (isValidToken) {
            const user = await authService.getCurrentUser();
            set({
              user,
              token: authService.getStoredToken(),
              isAuthenticated: true,
              isInitialized: true,
              isLoading: false,
              error: null
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isInitialized: true,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
            error: error.message
          });
        }
      },

      /**
       * Login user
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await authService.login(credentials);
          
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return result;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            isAuthenticated: false
          });
          throw error;
        }
      },

      /**
       * Register user
       */
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await authService.register(userData);
          
          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          return result;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            isAuthenticated: false
          });
          throw error;
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      /**
       * Refresh authentication token
       */
      refreshToken: async () => {
        try {
          const result = await authService.refreshToken();
          
          set({
            user: result.user || get().user,
            token: result.token,
            isAuthenticated: true,
            error: null
          });
          
          return result;
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: error.message
          });
          throw error;
        }
      },

      /**
       * Update user profile
       */
      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        
        set({ user: updatedUser });
        
        // Update stored user data
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      },

      /**
       * Clear authentication state
       */
      clearAuth: () => {
        authService._clearAuthData?.();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      // Computed values (getters)
      getUserName: () => {
        const { user } = get();
        return user?.name || user?.firstName || 'Guest';
      },

      getUserEmail: () => {
        const { user } = get();
        return user?.email || '';
      },

      getUserId: () => {
        const { user } = get();
        return user?.id || user?._id || null;
      },

      getUserInitials: () => {
        const { user } = get();
        if (!user?.name) return 'G';
        
        return user.name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      },

      /**
       * Check if user has specific role/permission
       */
      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      },

      /**
       * Check if user has specific permission
       */
      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions?.includes(permission) || false;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      version: 1,
      // Migration for future store versions
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            isInitialized: false
          };
        }
        return persistedState;
      }
    }
  )
);
