import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import { validateEmail, validateSLPhoneNumber, validateSLNIC } from '../../../utils/validation';

const CustomerForm = ({ 
  customer = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    customerCode: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    identificationNumber: '',
    creditRating: 5,
    creditLimit: 0,
    paymentTerms: 30,
    riskCategory: 'medium',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (customer) {
      setFormData({
        customerCode: customer.customerCode || '',
        name: customer.personalInfo?.name || '',
        email: customer.personalInfo?.email || '',
        phone: customer.personalInfo?.phone || '',
        address: customer.personalInfo?.address || '',
        identificationNumber: customer.personalInfo?.identificationNumber || '',
        creditRating: customer.creditProfile?.rating || 5,
        creditLimit: customer.creditProfile?.creditLimit || 0,
        paymentTerms: customer.creditProfile?.paymentTerms || 30,
        riskCategory: customer.creditProfile?.riskCategory || 'medium',
        status: customer.status || 'active'
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Customer Code validation
    if (!formData.customerCode.trim()) {
      newErrors.customerCode = 'Customer code is required';
    } else if (formData.customerCode.trim().length > 20) {
      newErrors.customerCode = 'Customer code cannot exceed 20 characters';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Customer name cannot exceed 100 characters';
    }

    // Phone validation (required)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneError = validateSLPhoneNumber(formData.phone.trim());
      if (phoneError) {
        newErrors.phone = phoneError;
      }
    }

    // Email validation (optional)
    if (formData.email.trim()) {
      if (!validateEmail(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Address validation
    if (formData.address.trim() && formData.address.trim().length > 255) {
      newErrors.address = 'Address cannot exceed 255 characters';
    }

    // Identification Number validation (optional)
    if (formData.identificationNumber.trim()) {
      const nicError = validateSLNIC(formData.identificationNumber.trim());
      if (nicError) {
        newErrors.identificationNumber = nicError;
      }
    }

    // Credit Rating validation
    const rating = parseFloat(formData.creditRating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      newErrors.creditRating = 'Credit rating must be between 1 and 10';
    }

    // Credit Limit validation
    const creditLimit = parseFloat(formData.creditLimit);
    if (isNaN(creditLimit) || creditLimit < 0) {
      newErrors.creditLimit = 'Credit limit cannot be negative';
    }

    // Payment Terms validation
    const paymentTerms = parseInt(formData.paymentTerms);
    if (isNaN(paymentTerms) || paymentTerms < 0 || !Number.isInteger(paymentTerms)) {
      newErrors.paymentTerms = 'Payment terms must be a positive whole number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Structure the data according to the backend model
    const submissionData = {
      customerCode: formData.customerCode.trim().toUpperCase(),
      personalInfo: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
        identificationNumber: formData.identificationNumber.trim() || undefined,
      },
      creditProfile: {
        rating: parseFloat(formData.creditRating),
        creditLimit: parseFloat(formData.creditLimit),
        paymentTerms: parseInt(formData.paymentTerms),
        riskCategory: formData.riskCategory.toLowerCase(),
      },
      status: formData.status.toLowerCase(),
    };

    // Remove undefined values
    Object.keys(submissionData.personalInfo).forEach(key => {
      if (submissionData.personalInfo[key] === undefined) {
        delete submissionData.personalInfo[key];
      }
    });

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Code */}
        <div>
          <Input
            label="Customer Code"
            name="customerCode"
            type="text"
            value={formData.customerCode}
            onChange={handleChange}
            error={errors.customerCode}
            required
            placeholder="e.g., CUS001"
            disabled={loading || !!customer} // Disable when editing
          />
        </div>

        {/* Customer Name */}
        <div>
          <Input
            label="Customer Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            placeholder="Enter customer name"
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="customer@example.com (optional)"
            disabled={loading}
          />
        </div>

        {/* Phone */}
        <div>
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="+94xxxxxxxxx or 0xxxxxxxxx"
            disabled={loading}
          />
        </div>

        {/* Identification Number (NIC) */}
        <div>
          <Input
            label="Identification Number (NIC)"
            name="identificationNumber"
            type="text"
            value={formData.identificationNumber}
            onChange={handleChange}
            error={errors.identificationNumber}
            placeholder="e.g., 123456789V or 200012345678"
            disabled={loading}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter customer address (optional)"
            disabled={loading}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Credit Profile Section */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4 pt-4 border-t border-gray-200">
            Credit Profile
          </h3>
        </div>

        {/* Credit Rating */}
        <div>
          <Input
            label="Credit Rating (1-10)"
            name="creditRating"
            type="number"
            min="1"
            max="10"
            step="0.1"
            value={formData.creditRating}
            onChange={handleChange}
            error={errors.creditRating}
            placeholder="5"
            disabled={loading}
          />
        </div>

        {/* Credit Limit */}
        <div>
          <Input
            label="Credit Limit"
            name="creditLimit"
            type="number"
            min="0"
            step="0.01"
            value={formData.creditLimit}
            onChange={handleChange}
            error={errors.creditLimit}
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        {/* Payment Terms */}
        <div>
          <Input
            label="Payment Terms (Days)"
            name="paymentTerms"
            type="number"
            min="0"
            step="1"
            value={formData.paymentTerms}
            onChange={handleChange}
            error={errors.paymentTerms}
            placeholder="30"
            disabled={loading}
          />
        </div>

        {/* Risk Category */}
        <div>
          <label htmlFor="riskCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Risk Category
          </label>
          <select
            id="riskCategory"
            name="riskCategory"
            value={formData.riskCategory}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};

CustomerForm.propTypes = {
  customer: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default CustomerForm;
