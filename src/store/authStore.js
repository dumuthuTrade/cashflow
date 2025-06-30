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

      initializeAuth: async () => {
        const currentState = get();
        if (currentState.isAuthenticated && currentState.user && currentState.token) {
          const isValidToken = authService.initializeAuth();
          if (isValidToken) {
            set({ isInitialized: true, isLoading: false });
            return;
          }
        }

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
          await get().logout();
          set({
            isInitialized: true,
            isLoading: false,
            error: 'Your session may have expired. Please log in again.'
          });
        }
      },

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

      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        
        set({ user: updatedUser });

        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      },

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

      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      },

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
      migrate: (persistedState, version) => {
        if (version === 0) {
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
