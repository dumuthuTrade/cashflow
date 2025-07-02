import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../atoms/Button';

const ChequeStatusModal = ({ 
  cheque, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  loading = false 
}) => {
  const [selectedStatus, setSelectedStatus] = useState(cheque?.status || 'pending');
  const [notes, setNotes] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', description: 'Cheque is pending' },
    { value: 'deposited', label: 'Deposited', description: 'Cheque has been deposited' },
    { value: 'cleared', label: 'Cleared', description: 'Cheque has been cleared by bank' },
    { value: 'bounced', label: 'Bounced', description: 'Cheque has bounced' },
    { value: 'cancelled', label: 'Cancelled', description: 'Cheque has been cancelled' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(cheque._id, selectedStatus, notes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Update Cheque Status
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {cheque && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Cheque:</strong> {cheque.chequeNumber || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Payee:</strong> {cheque.chequeDetails?.payeeName || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong> ${cheque.chequeDetails?.amount?.toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Current Status:</strong> 
                <span className="ml-1 capitalize">{cheque.status}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-sm text-gray-500 block">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about this status change..."
                disabled={loading}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Update Status
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

ChequeStatusModal.propTypes = {
  cheque: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ChequeStatusModal;
