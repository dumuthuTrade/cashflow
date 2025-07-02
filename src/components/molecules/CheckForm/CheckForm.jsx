import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';

const ChequeForm = ({ 
  cheque = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    chequeNumber: '',
    type: 'issued',
    relatedTransaction: {
      transactionId: '',
      transactionType: 'sale',
      customerId: '',
      supplierId: ''
    },
    chequeDetails: {
      amount: '',
      chequeDate: '',
      bankName: '',
      accountNumber: '',
      drawerName: '',
      payeeName: '',
      depositDate: '',
      clearanceDate: ''
    },
    status: 'pending',
    bankProcessing: {
      depositDate: '',
      clearanceDate: '',
      bounceDate: '',
      bounceReason: '',
      bankCharges: ''
    }
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (cheque) {
      setFormData({
        chequeNumber: cheque.chequeNumber || '',
        type: cheque.type || 'issued',
        relatedTransaction: {
          transactionId: cheque.relatedTransaction?.transactionId || '',
          transactionType: cheque.relatedTransaction?.transactionType || 'sale',
          customerId: cheque.relatedTransaction?.customerId || '',
          supplierId: cheque.relatedTransaction?.supplierId || ''
        },
        chequeDetails: {
          amount: cheque.chequeDetails?.amount || '',
          chequeDate: cheque.chequeDetails?.chequeDate ? cheque.chequeDetails.chequeDate.split('T')[0] : '',
          bankName: cheque.chequeDetails?.bankName || '',
          accountNumber: cheque.chequeDetails?.accountNumber || '',
          drawerName: cheque.chequeDetails?.drawerName || '',
          payeeName: cheque.chequeDetails?.payeeName || '',
          depositDate: cheque.chequeDetails?.depositDate ? cheque.chequeDetails.depositDate.split('T')[0] : '',
          clearanceDate: cheque.chequeDetails?.clearanceDate ? cheque.chequeDetails.clearanceDate.split('T')[0] : ''
        },
        status: cheque.status || 'pending',
        bankProcessing: {
          depositDate: cheque.bankProcessing?.depositDate ? cheque.bankProcessing.depositDate.split('T')[0] : '',
          clearanceDate: cheque.bankProcessing?.clearanceDate ? cheque.bankProcessing.clearanceDate.split('T')[0] : '',
          bounceDate: cheque.bankProcessing?.bounceDate ? cheque.bankProcessing.bounceDate.split('T')[0] : '',
          bounceReason: cheque.bankProcessing?.bounceReason || '',
          bankCharges: cheque.bankProcessing?.bankCharges || ''
        }
      });
    }
  }, [cheque]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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

    // Cheque Number validation (unique, max 50 characters)
    if (formData.chequeNumber && formData.chequeNumber.trim().length > 50) {
      newErrors.chequeNumber = 'Cheque number cannot exceed 50 characters';
    }

    // Type validation (required)
    if (!formData.type) {
      newErrors.type = 'Cheque type is required';
    }

    // Transaction ID validation (required, valid ObjectId format)
    if (!formData.relatedTransaction.transactionId) {
      newErrors['relatedTransaction.transactionId'] = 'Transaction ID is required';
    } else if (!/^[0-9a-fA-F]{24}$/.test(formData.relatedTransaction.transactionId)) {
      newErrors['relatedTransaction.transactionId'] = 'Transaction ID must be a valid ObjectId (24 characters)';
    }

    // Transaction Type validation (required)
    if (!formData.relatedTransaction.transactionType) {
      newErrors['relatedTransaction.transactionType'] = 'Transaction type is required';
    }

    // Customer/Supplier validation based on transaction type
    if (formData.relatedTransaction.transactionType === 'sale') {
      if (!formData.relatedTransaction.customerId) {
        newErrors['relatedTransaction.customerId'] = 'Customer is required for sale transactions';
      } else if (!/^[0-9a-fA-F]{24}$/.test(formData.relatedTransaction.customerId)) {
        newErrors['relatedTransaction.customerId'] = 'Customer ID must be a valid ObjectId (24 characters)';
      }
    }

    if (formData.relatedTransaction.transactionType === 'purchase') {
      if (!formData.relatedTransaction.supplierId) {
        newErrors['relatedTransaction.supplierId'] = 'Supplier is required for purchase transactions';
      } else if (!/^[0-9a-fA-F]{24}$/.test(formData.relatedTransaction.supplierId)) {
        newErrors['relatedTransaction.supplierId'] = 'Supplier ID must be a valid ObjectId (24 characters)';
      }
    }

    // Amount validation (required, minimum 0.01)
    if (!formData.chequeDetails.amount) {
      newErrors['chequeDetails.amount'] = 'Amount is required';
    } else {
      const amount = parseFloat(formData.chequeDetails.amount);
      if (isNaN(amount) || amount < 0.01) {
        newErrors['chequeDetails.amount'] = 'Amount must be at least 0.01';
      } else if (!Number.isFinite(amount)) {
        newErrors['chequeDetails.amount'] = 'Amount must be a valid positive number';
      }
    }

    // Cheque Date validation (required)
    if (!formData.chequeDetails.chequeDate) {
      newErrors['chequeDetails.chequeDate'] = 'Cheque date is required';
    }

    // Bank Name validation (required, max 100 characters)
    if (!formData.chequeDetails.bankName.trim()) {
      newErrors['chequeDetails.bankName'] = 'Bank name is required';
    } else if (formData.chequeDetails.bankName.trim().length > 100) {
      newErrors['chequeDetails.bankName'] = 'Bank name cannot exceed 100 characters';
    }

    // Account Number validation (required, max 50 characters)
    if (!formData.chequeDetails.accountNumber.trim()) {
      newErrors['chequeDetails.accountNumber'] = 'Account number is required';
    } else if (formData.chequeDetails.accountNumber.trim().length > 50) {
      newErrors['chequeDetails.accountNumber'] = 'Account number cannot exceed 50 characters';
    }

    // Drawer Name validation (required, max 100 characters)
    if (!formData.chequeDetails.drawerName.trim()) {
      newErrors['chequeDetails.drawerName'] = 'Drawer name is required';
    } else if (formData.chequeDetails.drawerName.trim().length > 100) {
      newErrors['chequeDetails.drawerName'] = 'Drawer name cannot exceed 100 characters';
    }

    // Payee Name validation (required, max 100 characters)
    if (!formData.chequeDetails.payeeName.trim()) {
      newErrors['chequeDetails.payeeName'] = 'Payee name is required';
    } else if (formData.chequeDetails.payeeName.trim().length > 100) {
      newErrors['chequeDetails.payeeName'] = 'Payee name cannot exceed 100 characters';
    }

    // Date validations
    const chequeDate = new Date(formData.chequeDetails.chequeDate);
    
    // Deposit Date validation (cannot be before cheque date)
    if (formData.chequeDetails.depositDate) {
      const depositDate = new Date(formData.chequeDetails.depositDate);
      if (depositDate < chequeDate) {
        newErrors['chequeDetails.depositDate'] = 'Deposit date cannot be before cheque date';
      }
    }

    // Clearance Date validation (cannot be before cheque date)
    if (formData.chequeDetails.clearanceDate) {
      const clearanceDate = new Date(formData.chequeDetails.clearanceDate);
      if (clearanceDate < chequeDate) {
        newErrors['chequeDetails.clearanceDate'] = 'Clearance date cannot be before cheque date';
      }
    }

    // Bank Processing validations
    if (formData.bankProcessing.depositDate) {
      const bankDepositDate = new Date(formData.bankProcessing.depositDate);
      if (bankDepositDate < chequeDate) {
        newErrors['bankProcessing.depositDate'] = 'Bank deposit date cannot be before cheque date';
      }
    }

    if (formData.bankProcessing.clearanceDate) {
      const bankClearanceDate = new Date(formData.bankProcessing.clearanceDate);
      if (formData.bankProcessing.depositDate) {
        const bankDepositDate = new Date(formData.bankProcessing.depositDate);
        if (bankClearanceDate < bankDepositDate) {
          newErrors['bankProcessing.clearanceDate'] = 'Clearance date cannot be before deposit date';
        }
      }
    }

    if (formData.bankProcessing.bounceDate) {
      const bounceDate = new Date(formData.bankProcessing.bounceDate);
      if (formData.bankProcessing.depositDate) {
        const bankDepositDate = new Date(formData.bankProcessing.depositDate);
        if (bounceDate < bankDepositDate) {
          newErrors['bankProcessing.bounceDate'] = 'Bounce date cannot be before deposit date';
        }
      }
    }

    // Bounce reason validation (required when status is bounced, max 200 characters)
    if (formData.status === 'bounced') {
      if (!formData.bankProcessing.bounceReason.trim()) {
        newErrors['bankProcessing.bounceReason'] = 'Bounce reason is required when status is bounced';
      } else if (formData.bankProcessing.bounceReason.trim().length > 200) {
        newErrors['bankProcessing.bounceReason'] = 'Bounce reason cannot exceed 200 characters';
      }
    }

    // Bank charges validation (non-negative number)
    if (formData.bankProcessing.bankCharges) {
      const charges = parseFloat(formData.bankProcessing.bankCharges);
      if (isNaN(charges) || charges < 0) {
        newErrors['bankProcessing.bankCharges'] = 'Bank charges cannot be negative';
      } else if (!Number.isFinite(charges)) {
        newErrors['bankProcessing.bankCharges'] = 'Bank charges must be a valid number';
      }
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
      chequeNumber: formData.chequeNumber.trim() || undefined,
      type: formData.type.toLowerCase(),
      relatedTransaction: {
        transactionId: formData.relatedTransaction.transactionId,
        transactionType: formData.relatedTransaction.transactionType.toLowerCase()
      },
      chequeDetails: {
        amount: parseFloat(formData.chequeDetails.amount),
        chequeDate: formData.chequeDetails.chequeDate,
        depositDate: formData.chequeDetails.depositDate || undefined,
        bankName: formData.chequeDetails.bankName.trim(),
        accountNumber: formData.chequeDetails.accountNumber.trim(),
        drawerName: formData.chequeDetails.drawerName.trim(),
        payeeName: formData.chequeDetails.payeeName.trim(),
        clearanceDate: formData.chequeDetails.clearanceDate || undefined
      },
      status: formData.status.toLowerCase(),
      bankProcessing: {
        depositDate: formData.bankProcessing.depositDate || undefined,
        clearanceDate: formData.bankProcessing.clearanceDate || undefined,
        bounceDate: formData.bankProcessing.bounceDate || undefined,
        bounceReason: formData.bankProcessing.bounceReason.trim() || undefined,
        bankCharges: formData.bankProcessing.bankCharges ? parseFloat(formData.bankProcessing.bankCharges) : 0
      }
    };

    // Add customer/supplier ID based on transaction type
    if (formData.relatedTransaction.transactionType === 'sale') {
      submissionData.relatedTransaction.customerId = formData.relatedTransaction.customerId;
    } else if (formData.relatedTransaction.transactionType === 'purchase') {
      submissionData.relatedTransaction.supplierId = formData.relatedTransaction.supplierId;
    }

    // Remove undefined values from nested objects
    Object.keys(submissionData.chequeDetails).forEach(key => {
      if (submissionData.chequeDetails[key] === undefined) {
        delete submissionData.chequeDetails[key];
      }
    });

    Object.keys(submissionData.bankProcessing).forEach(key => {
      if (submissionData.bankProcessing[key] === undefined) {
        delete submissionData.bankProcessing[key];
      }
    });

    // Remove undefined chequeNumber if empty
    if (submissionData.chequeNumber === undefined) {
      delete submissionData.chequeNumber;
    }

    onSubmit(submissionData);
  };

  const typeOptions = [
    { value: 'issued', label: 'Issued' },
    { value: 'received', label: 'Received' }
  ];

  const transactionTypeOptions = [
    { value: 'sale', label: 'Sale' },
    { value: 'purchase', label: 'Purchase' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'deposited', label: 'Deposited' },
    { value: 'cleared', label: 'Cleared' },
    { value: 'bounced', label: 'Bounced' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cheque Number */}
          <div>
            <Input
              label="Cheque Number"
              name="chequeNumber"
              type="text"
              maxLength="50"
              value={formData.chequeNumber}
              onChange={handleChange}
              error={errors.chequeNumber}
              placeholder="Enter cheque number (optional, max 50 chars)"
              disabled={loading}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Transaction Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Transaction ID */}
          <div>
            <Input
              label="Transaction ID"
              name="relatedTransaction.transactionId"
              type="text"
              value={formData.relatedTransaction.transactionId}
              onChange={handleChange}
              error={errors['relatedTransaction.transactionId']}
              required
              placeholder="Enter transaction ID (24 characters)"
              disabled={loading}
            />
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type <span className="text-red-500">*</span>
            </label>
            <select
              name="relatedTransaction.transactionType"
              value={formData.relatedTransaction.transactionType}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
              {transactionTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors['relatedTransaction.transactionType'] && (
              <p className="mt-1 text-sm text-red-600">{errors['relatedTransaction.transactionType']}</p>
            )}
          </div>

          {/* Customer ID - only show for sale transactions */}
          {formData.relatedTransaction.transactionType === 'sale' && (
            <div>
              <Input
                label="Customer ID"
                name="relatedTransaction.customerId"
                type="text"
                value={formData.relatedTransaction.customerId}
                onChange={handleChange}
                error={errors['relatedTransaction.customerId']}
                required
                placeholder="Enter customer ID (24 characters)"
                disabled={loading}
              />
            </div>
          )}

          {/* Supplier ID - only show for purchase transactions */}
          {formData.relatedTransaction.transactionType === 'purchase' && (
            <div>
              <Input
                label="Supplier ID"
                name="relatedTransaction.supplierId"
                type="text"
                value={formData.relatedTransaction.supplierId}
                onChange={handleChange}
                error={errors['relatedTransaction.supplierId']}
                required
                placeholder="Enter supplier ID (24 characters)"
                disabled={loading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Cheque Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Cheque Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <Input
              label="Amount"
              name="chequeDetails.amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.chequeDetails.amount}
              onChange={handleChange}
              error={errors['chequeDetails.amount']}
              required
              placeholder="0.00"
              disabled={loading}
            />
          </div>

          {/* Cheque Date */}
          <div>
            <Input
              label="Cheque Date"
              name="chequeDetails.chequeDate"
              type="date"
              value={formData.chequeDetails.chequeDate}
              onChange={handleChange}
              error={errors['chequeDetails.chequeDate']}
              required
              disabled={loading}
            />
          </div>

          {/* Bank Name */}
          <div>
            <Input
              label="Bank Name"
              name="chequeDetails.bankName"
              type="text"
              maxLength="100"
              value={formData.chequeDetails.bankName}
              onChange={handleChange}
              error={errors['chequeDetails.bankName']}
              required
              placeholder="Enter bank name (max 100 chars)"
              disabled={loading}
            />
          </div>

          {/* Account Number */}
          <div>
            <Input
              label="Account Number"
              name="chequeDetails.accountNumber"
              type="text"
              maxLength="50"
              value={formData.chequeDetails.accountNumber}
              onChange={handleChange}
              error={errors['chequeDetails.accountNumber']}
              required
              placeholder="Enter account number (max 50 chars)"
              disabled={loading}
            />
          </div>

          {/* Drawer Name */}
          <div>
            <Input
              label="Drawer Name"
              name="chequeDetails.drawerName"
              type="text"
              maxLength="100"
              value={formData.chequeDetails.drawerName}
              onChange={handleChange}
              error={errors['chequeDetails.drawerName']}
              required
              placeholder="Enter drawer name (max 100 chars)"
              disabled={loading}
            />
          </div>

          {/* Payee Name */}
          <div>
            <Input
              label="Payee Name"
              name="chequeDetails.payeeName"
              type="text"
              maxLength="100"
              value={formData.chequeDetails.payeeName}
              onChange={handleChange}
              error={errors['chequeDetails.payeeName']}
              required
              placeholder="Enter payee name (max 100 chars)"
              disabled={loading}
            />
          </div>

          {/* Deposit Date */}
          <div>
            <Input
              label="Deposit Date"
              name="chequeDetails.depositDate"
              type="date"
              value={formData.chequeDetails.depositDate}
              onChange={handleChange}
              error={errors['chequeDetails.depositDate']}
              placeholder="Optional"
              disabled={loading}
            />
          </div>

          {/* Clearance Date */}
          <div>
            <Input
              label="Clearance Date"
              name="chequeDetails.clearanceDate"
              type="date"
              value={formData.chequeDetails.clearanceDate}
              onChange={handleChange}
              error={errors['chequeDetails.clearanceDate']}
              placeholder="Optional"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Bank Processing - show only for certain statuses */}
      {(formData.status === 'deposited' || formData.status === 'cleared' || formData.status === 'bounced') && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Bank Processing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bank Deposit Date */}
            <div>
              <Input
                label="Bank Deposit Date"
                name="bankProcessing.depositDate"
                type="date"
                value={formData.bankProcessing.depositDate}
                onChange={handleChange}
                error={errors['bankProcessing.depositDate']}
                disabled={loading}
              />
            </div>

            {/* Bank Clearance Date */}
            {formData.status === 'cleared' && (
              <div>
                <Input
                  label="Bank Clearance Date"
                  name="bankProcessing.clearanceDate"
                  type="date"
                  value={formData.bankProcessing.clearanceDate}
                  onChange={handleChange}
                  error={errors['bankProcessing.clearanceDate']}
                  disabled={loading}
                />
              </div>
            )}

            {/* Bounce Date and Reason */}
            {formData.status === 'bounced' && (
              <>
                <div>
                  <Input
                    label="Bounce Date"
                    name="bankProcessing.bounceDate"
                    type="date"
                    value={formData.bankProcessing.bounceDate}
                    onChange={handleChange}
                    error={errors['bankProcessing.bounceDate']}
                    disabled={loading}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Bounce Reason"
                    name="bankProcessing.bounceReason"
                    type="text"
                    maxLength="200"
                    value={formData.bankProcessing.bounceReason}
                    onChange={handleChange}
                    error={errors['bankProcessing.bounceReason']}
                    required={formData.status === 'bounced'}
                    placeholder="Enter reason for bounce (max 200 chars)"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Bank Charges */}
            <div>
              <Input
                label="Bank Charges"
                name="bankProcessing.bankCharges"
                type="number"
                step="0.01"
                min="0"
                value={formData.bankProcessing.bankCharges}
                onChange={handleChange}
                error={errors['bankProcessing.bankCharges']}
                placeholder="0.00"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}

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
          {cheque ? 'Update Cheque' : 'Create Cheque'}
        </Button>
      </div>
    </form>
  );
};

ChequeForm.propTypes = {
  cheque: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ChequeForm;
