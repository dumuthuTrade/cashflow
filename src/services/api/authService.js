import apiClient from './client';
import { AuthError, ValidationError } from '../../utils/errors';
import { validateLogin, validateRegistration } from '../../utils/validation';

/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */
class AuthService {
  constructor() {
    this.tokenKey = 'auth_token';
    this.userKey = 'user_data';
    this.refreshTokenKey = 'refresh_token';
  }

  /**
   * Store authentication data securely
   * @private
   */
  _storeAuthData(response) {
    if (response.token) {
      apiClient.setToken(response.token);
      localStorage.setItem(this.tokenKey, response.token);
    }
    
    if (response.refreshToken) {
      localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    }
    
    if (response.user) {
      localStorage.setItem(this.userKey, JSON.stringify(response.user));
    }
  }

  /**
   * Clear all authentication data
   * @private
   */
  _clearAuthData() {
    apiClient.setToken(null);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  /**
   * Handle API errors consistently
   * @private
   */
  _handleAuthError(error, defaultMessage) {
    if (error.name === 'ValidationError') {
      throw error;
    }
    
    // Handle specific HTTP status codes
    if (error.status === 401) {
      this._clearAuthData();
      throw new AuthError('Invalid credentials. Please try again.');
    }
    
    if (error.status === 403) {
      throw new AuthError('Access denied. Please contact support.');
    }
    
    if (error.status === 429) {
      throw new AuthError('Too many attempts. Please try again later.');
    }
    
    throw new AuthError(error.message || defaultMessage);
  }

  /**
   * Login user with credentials
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} User data and authentication info
   */
  async login(credentials) {
    // Validate input
    const validation = validateLogin(credentials);
    if (!validation.isValid) {
      throw new ValidationError('Invalid login data', validation.errors);
    }

    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.status === 'success') {
        this._storeAuthData(response);
        return {
          user: response.user,
          token: response.token,
          message: response.message || 'Login successful'
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      this._handleAuthError(error, 'Login failed. Please try again.');
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} User data and authentication info
   */
  async register(userData) {
    // Validate input
    const validation = validateRegistration(userData);
    if (!validation.isValid) {
      throw new ValidationError('Invalid registration data', validation.errors);
    }

    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.status === 'success') {
        this._storeAuthData(response);
        return {
          user: response.user,
          token: response.token,
          message: response.message || 'Registration successful'
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      this._handleAuthError(error, 'Registration failed. Please try again.');
    }
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Try to notify the server
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Log error but don't throw - we still want to clear local storage
      console.warn('Server logout failed:', error.message);
    } finally {
      this._clearAuthData();
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} New token data
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    
    if (!refreshToken) {
      throw new AuthError('No refresh token available');
    }

    try {
      const response = await apiClient.post('/auth/refresh', { refreshToken });
      
      if (response.status === 'success') {
        this._storeAuthData(response);
        return {
          token: response.token,
          user: response.user
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      this._clearAuthData();
      this._handleAuthError(error, 'Session expired. Please login again.');
    }
  }

  /**
   * Get current user data
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      
      if (response.status === 'success' && response.user) {
        // Update stored user data
        localStorage.setItem(this.userKey, JSON.stringify(response.user));
        return response.user;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      this._handleAuthError(error, 'Failed to get user data');
    }
  }

  /**
   * Initialize auth from stored token
   */
  initializeAuth() {
    const token = localStorage.getItem(this.tokenKey);
    if (token && this.isValidTokenFormat(token)) {
      apiClient.setToken(token);
      return true;
    }
    return false;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = localStorage.getItem(this.tokenKey);
    return token && this.isValidTokenFormat(token);
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data or null
   */
  getStoredUser() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      return null;
    }
  }

  /**
   * Get stored token
   * @returns {string|null} Token or null
   */
  getStoredToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Validate JWT token format
   * @param {string} token - Token to validate
   * @returns {boolean} Validation result
   */
  isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') return false;
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Current and new password data
   * @returns {Promise<Object>} Success response
   */
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData);
      
      if (response.status === 'success') {
        return { message: response.message || 'Password changed successfully' };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      this._handleAuthError(error, 'Failed to change password');
    }
  }

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Success response
   */
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      
      if (response.status === 'success') {
        return { message: response.message || 'Password reset email sent' };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      this._handleAuthError(error, 'Failed to send password reset email');
    }
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Token and new password data
   * @returns {Promise<Object>} Success response
   */
  async resetPassword(resetData) {
    try {
      const response = await apiClient.post('/auth/reset-password', resetData);
      
      if (response.status === 'success') {
        return { message: response.message || 'Password reset successful' };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      this._handleAuthError(error, 'Failed to reset password');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
