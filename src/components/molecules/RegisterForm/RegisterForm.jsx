import { useState, useCallback, useMemo } from 'react';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import { validateRegistration } from '../../../utils/validation';
import { AuthError, ValidationError } from '../../../utils/errors';
import PropTypes from 'prop-types';

const RegisterForm = ({ 
  onSubmit, 
  isLoading = false, 
  autoFocus = true,
  showTermsAcceptance = true,
  onTermsClick,
  onPrivacyClick 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Memoized validation
  const validationResult = useMemo(() => {
    return validateRegistration(formData);
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
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true
    });

    // Validate form
    const newErrors = {};
    
    if (!validationResult.isValid) {
      Object.keys(validationResult.errors).forEach(field => {
        newErrors[field] = validationResult.errors[field][0];
      });
    }

    // Check terms acceptance if required
    if (showTermsAcceptance && !formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});
      const { confirmPassword: _confirmPassword, acceptTerms: _acceptTerms, ...registrationData } = formData;
      await onSubmit(registrationData);
    } catch (error) {
      if (error instanceof ValidationError) {
        const apiErrors = {};
        Object.keys(error.errors).forEach(field => {
          apiErrors[field] = Array.isArray(error.errors[field]) 
            ? error.errors[field][0] 
            : error.errors[field];
        });
        setErrors(apiErrors);
      } else if (error instanceof AuthError) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  }, [formData, validationResult, onSubmit, showTermsAcceptance]);

  const isFormValid = validationResult.isValid && (!showTermsAcceptance || formData.acceptTerms);
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

      {/* Name field */}
      <div>
        <Input
          type="text"
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : ''}
          autoComplete="name"
          autoFocus={autoFocus}
          required
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
      </div>

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
          placeholder="Create a secure password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : ''}
          autoComplete="new-password"
          required
          aria-describedby={errors.password ? 'password-error' : 'password-help'}
        />
        <p id="password-help" className="mt-1 text-xs text-gray-500">
          Password must be at least 6 characters long
        </p>
      </div>
      
      {/* Confirm password field */}
      <div>
        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirmPassword ? errors.confirmPassword : ''}
          autoComplete="new-password"
          required
          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
        />
      </div>

      {/* Terms acceptance */}
      {showTermsAcceptance && (
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acceptTerms" className="text-gray-700">
              I accept the{' '}
              {onTermsClick ? (
                <button
                  type="button"
                  onClick={onTermsClick}
                  className="text-blue-600 hover:text-blue-500 underline"
                >
                  Terms of Service
                </button>
              ) : (
                <span className="text-blue-600">Terms of Service</span>
              )}
              {' '}and{' '}
              {onPrivacyClick ? (
                <button
                  type="button"
                  onClick={onPrivacyClick}
                  className="text-blue-600 hover:text-blue-500 underline"
                >
                  Privacy Policy
                </button>
              ) : (
                <span className="text-blue-600">Privacy Policy</span>
              )}
            </label>
            {touched.acceptTerms && errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.acceptTerms}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitDisabled}
        loading={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      {/* Helper text */}
      <p className="text-xs text-gray-500 text-center">
        Already have an account?{' '}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium"
          onClick={() => window.location.hash = '#login'}
        >
          Sign in here
        </button>
      </p>
    </form>
  );
};

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  autoFocus: PropTypes.bool,
  showTermsAcceptance: PropTypes.bool,
  onTermsClick: PropTypes.func,
  onPrivacyClick: PropTypes.func,
};

export default RegisterForm;
