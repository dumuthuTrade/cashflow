import React, { useState } from 'react';
import { Edit2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate, getSupplierName } from '../../utils/helpers';
import { useChequeContext } from '../../context/ChequeContext';
import Modal from '../ui/Modal';

const PendingCheques = () => {
  const { cheques, suppliers, updateChequeStatus } = useChequeContext();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCheque, setSelectedCheque] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  // Get all issued cheques that are not cleared, cancelled, or bounced and are due up to today
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of today
  
  const pendingCheques = cheques.filter(c => {
    const dueDate = new Date(c.dueDate);
    return c.status === 'issued' && dueDate <= today;
  });
  
  console.log('Pending Cheques (due till today):', pendingCheques);
  

  const handleStatusChange = (cheque) => {
    setSelectedCheque(cheque);
    setNewStatus(cheque.status);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedCheque && newStatus) {
      updateChequeStatus(selectedCheque.id, newStatus);
      setShowStatusModal(false);
      setSelectedCheque(null);
      setNewStatus('');
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'cleared':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'bounced':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default:
        return <Edit2 className="h-4 w-4 text-blue-600" />;
    }
  };

  if (pendingCheques.length === 0) {
    return (      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Pending Cheques (Due Till Today)</h3>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-500">No pending cheques due till today! All due cheques have been processed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Pending Cheques (Due Till Today)</h3>
            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {pendingCheques.length} pending
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Total pending amount: {formatCurrency(pendingCheques.reduce((sum, c) => sum + c.amount, 0))}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cheque #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Until Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingCheques.map((cheque) => {
                const dueDate = new Date(cheque.dueDate);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntilDue < 0;
                const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

                return (
                  <tr key={cheque.id} className={isOverdue ? 'bg-red-50' : isDueSoon ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cheque.chequeNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSupplierName(suppliers, cheque.supplierId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(cheque.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(cheque.issueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(cheque.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isOverdue 
                          ? 'bg-red-100 text-red-800' 
                          : isDueSoon 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(cheque)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Cheque Status"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Updating status for cheque: <span className="font-medium">{selectedCheque?.chequeNumber}</span>
            </p>
            <p className="text-sm text-gray-600">
              Amount: <span className="font-medium">{selectedCheque && formatCurrency(selectedCheque.amount)}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <div className="space-y-2">
              {['cleared', 'bounced', 'cancelled'].map((status) => (
                <label key={status} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={newStatus === status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 flex items-center">
                    {getStatusIcon(status)}
                    <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStatus}
              disabled={!newStatus || newStatus === selectedCheque?.status}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PendingCheques;
