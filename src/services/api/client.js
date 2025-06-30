import { AuthError, NetworkError, ApiError } from '../../utils/errors';
import config from '../../config/environment';

/**
 * Enhanced API Client with better error handling and interceptors
 */
class ApiClient {
  constructor(baseURL = config.apiUrl) {
    this.baseURL = baseURL;
    this.token = null;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.defaultTimeout = 30000; // 30 seconds
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Get current token
   */
  getToken() {
    return this.token;
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Apply request interceptors
   * @private
   */
  _applyRequestInterceptors(config) {
    return this.requestInterceptors.reduce((acc, interceptor) => {
      return interceptor(acc);
    }, config);
  }

  /**
   * Apply response interceptors
   * @private
   */
  _applyResponseInterceptors(response) {
    return this.responseInterceptors.reduce((acc, interceptor) => {
      return interceptor(acc);
    }, response);
  }

  /**
   * Handle API errors consistently
   * @private
   */
  _handleError(error, response = null) {
    // Network errors
    if (!response) {
      if (error.name === 'AbortError') {
        throw new NetworkError('Request was cancelled');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new NetworkError('Network connection failed. Please check your internet connection.');
      }
      throw new NetworkError('Network error occurred');
    }

    // HTTP errors
    const status = response.status;
    let errorMessage = 'An unexpected error occurred';

    // Try to extract error message from response
    if (response.json) {
      try {
        const errorData = typeof response.json === 'function' ? response.json() : response.json;
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Ignore JSON parsing errors
      }
    }

    // Handle specific status codes
    switch (status) {
      case 400:
        throw new ApiError(errorMessage || 'Bad Request', status, response);
      case 401:
        throw new AuthError(errorMessage || 'Unauthorized. Please login again.', 'UNAUTHORIZED');
      case 403:
        throw new AuthError(errorMessage || 'Access forbidden.', 'FORBIDDEN');
      case 404:
        throw new ApiError(errorMessage || 'Resource not found', status, response);
      case 409:
        throw new ApiError(errorMessage || 'Resource conflict', status, response);
      case 422:
        throw new ApiError(errorMessage || 'Validation failed', status, response);
      case 429:
        throw new ApiError(errorMessage || 'Too many requests. Please try again later.', status, response);
      case 500:
        throw new ApiError('Server error. Please try again later.', status, response);
      case 503:
        throw new ApiError('Service temporarily unavailable. Please try again later.', status, response);
      default:
        throw new ApiError(errorMessage, status, response);
    }
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Default configuration
    let config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: this.defaultTimeout,
      ...options,
    };

    // Add authentication header
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    // Apply request interceptors
    config = this._applyRequestInterceptors(config);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Apply response interceptors
      const processedResponse = this._applyResponseInterceptors(response);

      // Handle non-2xx responses
      if (!processedResponse.ok) {
        const errorData = await processedResponse.json().catch(() => null);
        this._handleError(null, { 
          status: processedResponse.status, 
          json: () => errorData 
        });
      }

      // Handle empty responses
      const contentType = processedResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await processedResponse.json();
        
        // Handle API error responses with success: false
        if (data.status === 'error' || data.success === false) {
          throw new ApiError(data.message || 'API request failed', processedResponse.status, data);
        }
        
        return data;
      }
      
      return processedResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof AuthError || error instanceof ApiError || error instanceof NetworkError) {
        throw error;
      }
      
      this._handleError(error);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}, options = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Upload file
   */
  async upload(endpoint, file, progressCallback = null, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type header for file uploads
    delete config.headers['Content-Type'];

    // Add progress tracking if callback provided
    if (progressCallback && typeof progressCallback === 'function') {
      // Note: Progress tracking with fetch is limited
      // Consider using XMLHttpRequest for better upload progress support
    }

    return this.request(endpoint, config);
  }

  /**
   * Set request timeout
   */
  setTimeout(timeout) {
    this.defaultTimeout = timeout;
  }

  /**
   * Clear all interceptors
   */
  clearInterceptors() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }
}

// Create and configure singleton instance
const apiClient = new ApiClient();

// Add default response interceptor for logging
if (import.meta.env.DEV) {
  apiClient.addResponseInterceptor((response) => {
    console.log('API Response:', {
      url: response.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  });
}

// Add request interceptor for logging in development
if (import.meta.env.DEV) {
  apiClient.addRequestInterceptor((config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url || 'URL not available',
      headers: config.headers
    });
    return config;
  });
}

export default apiClient;
