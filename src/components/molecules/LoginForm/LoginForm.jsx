import { useState, useCallback, useMemo } from 'react';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import { validateLogin } from '../../../utils/validation';
import { AuthError, ValidationError } from '../../../utils/errors';
import PropTypes from 'prop-types';

/**
 * Enhanced LoginForm Component
 * Improved error handling, accessibility, and user experience
 */
const LoginForm = ({ 
  onSubmit, 
  isLoading = false, 
  autoFocus = true,
  showRememberMe = true,
  onForgotPassword 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Memoized validation to prevent unnecessary re-renders
  const validationResult = useMemo(() => {
    return validateLogin(formData);
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Show field-specific validation errors on blur
    if (!validationResult.isValid && validationResult.errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validationResult.errors[name][0]
      }));
    }
  }, [validationResult]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });

    // Validate form
    if (!validationResult.isValid) {
      const newErrors = {};
      Object.keys(validationResult.errors).forEach(field => {
        newErrors[field] = validationResult.errors[field][0];
      });
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      const { rememberMe, ...credentials } = formData;
      await onSubmit(credentials, { rememberMe });
    } catch (error) {
      if (error instanceof ValidationError) {
        const newErrors = {};
        Object.keys(error.errors).forEach(field => {
          newErrors[field] = Array.isArray(error.errors[field]) 
            ? error.errors[field][0] 
            : error.errors[field];
        });
        setErrors(newErrors);
      } else if (error instanceof AuthError) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  }, [formData, validationResult, onSubmit]);

  const isFormValid = validationResult.isValid;
  const isSubmitDisabled = isLoading || !isFormValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* General error message */}
      {errors.general && (
        <div 
          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
          role="alert"
          aria-live="polite"
        >
          {errors.general}
        </div>
      )}

      {/* Email field */}
      <div>
        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : ''}
          autoComplete="email"
          autoFocus={autoFocus}
          required
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
      </div>
      
      {/* Password field */}
      <div>
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : ''}
          autoComplete="current-password"
          required
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
      </div>

      {/* Remember me and forgot password */}
      <div className="flex items-center justify-between">
        {showRememberMe && (
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
        )}

        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
          >
            Forgot your password?
          </button>
        )}
      </div>
      
      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitDisabled}
        loading={isLoading}
        aria-describedby="submit-help"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* Helper text */}
      <p id="submit-help" className="text-xs text-gray-500 text-center">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  autoFocus: PropTypes.bool,
  showRememberMe: PropTypes.bool,
  onForgotPassword: PropTypes.func,
};

export default LoginForm;
