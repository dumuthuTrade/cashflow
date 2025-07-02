/**
 * Environment configuration and validation
 */

const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_BASE_URL || 
          import.meta.env.VITE_API_URL || 
          'http://localhost:8080/api',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Cashflow Web',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development
  isDev: import.meta.env.DEV || false,
  isProd: import.meta.env.PROD || false,
};

/**
 * Validate environment configuration
 */
export const validateConfig = () => {
  const issues = [];
  
  if (!config.apiUrl) {
    issues.push('API URL is not configured');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    config
  };
};

export default config;
