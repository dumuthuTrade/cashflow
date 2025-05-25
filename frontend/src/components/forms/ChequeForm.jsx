import React from 'react';
import { useChequeContext } from '../../context/ChequeContext';
import { useChequeActions } from '../../hooks/useChequeActions';

const ChequeForm = () => {
  const { 
    suppliers, 
    newCheque, 
    setNewCheque, 
    editingCheque,
    setShowAddCheque,
    setEditingCheque 
  } = useChequeContext();
  
  const { handleAddCheque, handleUpdateCheque, resetChequeForm } = useChequeActions();

  const handleClose = () => {
    setShowAddCheque(false);
    setEditingCheque(null);
    resetChequeForm();
  };

  const handleSubmit = () => {
    if (editingCheque) {
      handleUpdateCheque();
    } else {
      handleAddCheque();
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Cheque Number"
        value={newCheque.chequeNumber}
        onChange={(e) => setNewCheque({ ...newCheque, chequeNumber: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      <select
        value={newCheque.supplierId}
        onChange={(e) => setNewCheque({ ...newCheque, supplierId: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="">Select Supplier</option>
        {suppliers.map(supplier => (
          <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={newCheque.amount}
        onChange={(e) => setNewCheque({ ...newCheque, amount: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      <input
        type="date"
        placeholder="Issue Date"
        value={newCheque.issueDate}
        onChange={(e) => setNewCheque({ ...newCheque, issueDate: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      <input
        type="date"
        placeholder="Due Date"
        value={newCheque.dueDate}
        onChange={(e) => setNewCheque({ ...newCheque, dueDate: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      <select
        value={newCheque.status}
        onChange={(e) => setNewCheque({ ...newCheque, status: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
        <option value="issued">Issued</option>
        <option value="cleared">Cleared</option>
        <option value="bounced">Bounced</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <textarea
        placeholder="Description"
        value={newCheque.description}
        onChange={(e) => setNewCheque({ ...newCheque, description: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        rows="3"
      />

      <div className="flex justify-end space-x-2">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {editingCheque ? 'Update' : 'Add'} Cheque
        </button>
      </div>
    </div>
  );
};

export default ChequeForm;
