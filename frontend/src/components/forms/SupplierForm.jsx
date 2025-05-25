import React from 'react';
import { useChequeContext } from '../../context/ChequeContext';
import { useSupplierActions } from '../../hooks/useSupplierActions';

const SupplierForm = () => {
  const { 
    newSupplier, 
    setNewSupplier, 
    editingSupplier,
    setShowAddSupplier,
    setEditingSupplier 
  } = useChequeContext();
  
  const { handleAddSupplier, handleUpdateSupplier, resetSupplierForm } = useSupplierActions();

  const handleClose = () => {
    setShowAddSupplier(false);
    setEditingSupplier(null);
    resetSupplierForm();
  };

  const handleSubmit = () => {
    if (editingSupplier) {
      handleUpdateSupplier();
    } else {
      handleAddSupplier();
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Supplier Name"
        value={newSupplier.name}
        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      <input
        type="text"
        placeholder="Contact Number"
        value={newSupplier.contact}
        onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
      />

      <input
        type="text"
        placeholder="Account Number"
        value={newSupplier.accountNumber}
        onChange={(e) => setNewSupplier({ ...newSupplier, accountNumber: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
          {editingSupplier ? 'Update' : 'Add'} Supplier
        </button>
      </div>
    </div>
  );
};

export default SupplierForm;
