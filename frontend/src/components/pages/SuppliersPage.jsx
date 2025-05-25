import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useChequeContext } from '../../context/ChequeContext';
import { useSupplierActions } from '../../hooks/useSupplierActions';
import { formatCurrency } from '../../utils/helpers';
import Modal from '../ui/Modal';
import SupplierForm from '../forms/SupplierForm';

const SuppliersPage = () => {
  const { 
    suppliers, 
    cheques,
    showAddSupplier, 
    setShowAddSupplier, 
    editingSupplier,
    setEditingSupplier,
    setNewSupplier 
  } = useChequeContext();
  
  const { handleDeleteSupplier, resetSupplierForm } = useSupplierActions();

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setNewSupplier(supplier);
    setShowAddSupplier(true);
  };

  const handleCloseModal = () => {
    setShowAddSupplier(false);
    setEditingSupplier(null);
    resetSupplierForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier Management</h2>
        <button
          onClick={() => setShowAddSupplier(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => {
          const supplierCheques = cheques.filter(c => c.supplierId === supplier.id);
          const totalAmount = supplierCheques.reduce((sum, c) => sum + c.amount, 0);

          return (
            <div key={supplier.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditSupplier(supplier)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Contact:</span> {supplier.contact}</p>
                <p><span className="font-medium">Account:</span> {supplier.accountNumber}</p>
                <p><span className="font-medium">Total Cheques:</span> {supplierCheques.length}</p>
                <p><span className="font-medium">Total Amount:</span> {formatCurrency(totalAmount)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={showAddSupplier}
        onClose={handleCloseModal}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <SupplierForm />
      </Modal>
    </div>
  );
};

export default SuppliersPage;
