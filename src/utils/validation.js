/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate password strength (stricter version)
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validatePasswordStrict = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate number field
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Error message or null if valid
 */
export const validateNumber = (value, options = {}) => {
  const { min, max, fieldName = 'Value' } = options;
  
  if (isNaN(value) || value === '') {
    return `${fieldName} must be a valid number`;
  }
  
  const numValue = parseFloat(value);
  
  if (min !== undefined && numValue < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (max !== undefined && numValue > max) {
    return `${fieldName} must not exceed ${max}`;
  }
  
  return null;
};

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with isValid and errors
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    fieldRules.forEach(rule => {
      if (typeof rule === 'function') {
        const error = rule(value, field);
        if (error) {
          errors[field] = error;
        }
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate name field (2-50 characters)
 * @param {string} name - Name to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateName = (name) => {
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (name && name.trim().length > 50) {
    errors.push('Name must not exceed 50 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate registration data
 * @param {Object} userData - User registration data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateRegistration = (userData) => {
  const errors = {};
  
  // Validate name
  const nameValidation = validateName(userData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.errors;
  }
  
  // Validate email
  if (!userData.email) {
    errors.email = ['Email is required'];
  } else if (!validateEmail(userData.email)) {
    errors.email = ['Please enter a valid email address'];
  }
  
  // Validate password
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors;
  }
  
  // Validate password confirmation if provided
  if (userData.confirmPassword && userData.password !== userData.confirmPassword) {
    errors.confirmPassword = ['Passwords do not match'];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login data
 * @param {Object} credentials - User login credentials
 * @returns {Object} Validation result with isValid and errors
 */
export const validateLogin = (credentials) => {
  const errors = {};
  
  // Validate email
  if (!credentials.email) {
    errors.email = ['Email is required'];
  } else if (!validateEmail(credentials.email)) {
    errors.email = ['Please enter a valid email address'];
  }
  
  // Validate password
  if (!credentials.password) {
    errors.password = ['Password is required'];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate Sri Lankan phone number
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateSLPhoneNumber = (phone) => {
  if (!phone) return null; // Optional field
  const phoneRegex = /^(?:\+94|0)(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(?:0|1|2|4|5|6|7|8)\d)\d{6}$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid Sri Lankan phone number';
  }
  if (phone.length > 20) {
    return 'Phone number cannot exceed 20 characters';
  }
  return null;
};

/**
 * Validate Sri Lankan NIC
 * @param {string} nic - NIC to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateSLNIC = (nic) => {
  if (!nic) return null; // Optional field
  const nicRegex = /^(?:\d{9}[vVxX]|\d{12})$/;
  if (!nicRegex.test(nic)) {
    return 'Please enter a valid Sri Lankan NIC (9 digits with V/X or 12 digits)';
  }
  return null;
};
