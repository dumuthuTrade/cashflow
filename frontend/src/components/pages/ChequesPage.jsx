import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import { useChequeContext } from '../../context/ChequeContext';
import { useChequeActions } from '../../hooks/useChequeActions';
import { formatCurrency, formatDate, getStatusColor, getSupplierName, exportToCSV } from '../../utils/helpers';
import Modal from '../ui/Modal';
import ChequeForm from '../forms/ChequeForm';
import ChequeFilters from '../ui/ChequeFilters';
import SupplierForm from '../forms/SupplierForm';

const ChequesPage = () => {
  const { 
    cheques, 
    suppliers, 
    showAddCheque, 
    setShowAddCheque, 
    editingCheque,
    setShowAddCheque: setShowModal,
    setEditingCheque,
    showAddSupplier,
    setShowAddSupplier,
    editingSupplier,
    setEditingSupplier 
  } = useChequeContext();
    const { handleEditCheque, handleDeleteCheque, resetChequeForm } = useChequeActions();
  const [filters, setFilters] = useState({
    dueDateFrom: '',
    dueDateTo: '',
    status: '',
    supplier: ''
  });

  // Filter cheques based on current filters
  const filteredCheques = useMemo(() => {
    return cheques.filter(cheque => {
      // Due date from filter
      if (filters.dueDateFrom && cheque.dueDate < filters.dueDateFrom) {
        return false;
      }
      
      // Due date to filter
      if (filters.dueDateTo && cheque.dueDate > filters.dueDateTo) {
        return false;
      }
      
      // Status filter
      if (filters.status && cheque.status !== filters.status) {
        return false;
      }
      
      // Supplier filter
      if (filters.supplier && cheque.supplierId !== parseInt(filters.supplier)) {
        return false;
      }
      
      return true;
    });
  }, [cheques, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredCheques, suppliers);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCheque(null);
    resetChequeForm();
  };

  const handleCloseSupplierModal = () => {
    setShowAddSupplier(false);
    setEditingSupplier(null);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cheque Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddCheque(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cheque
          </button>
        </div>
      </div>      {/* Filters Component */}
      <ChequeFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
        filteredCount={filteredCheques.length}
        totalCount={cheques.length}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cheque #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCheques.length > 0 ? (
                filteredCheques.map((cheque) => (
                  <tr key={cheque.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cheque.chequeNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSupplierName(suppliers, cheque.supplierId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(cheque.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(cheque.issueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(cheque.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cheque.status)}`}>
                        {cheque.status.charAt(0).toUpperCase() + cheque.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCheque(cheque)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCheque(cheque.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-medium mb-2">No cheques found</div>
                      <div className="text-sm">
                        {cheques.length === 0 
                          ? "No cheques have been added yet." 
                          : "Try adjusting your filters to see more results."
                        }
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cheque Modal */}
      <Modal
        isOpen={showAddCheque}
        onClose={handleCloseModal}
        title={editingCheque ? 'Edit Cheque' : 'Add New Cheque'}
      >
        <ChequeForm />
      </Modal>

      {/* Supplier Modal */}
      <Modal
        isOpen={showAddSupplier}
        onClose={handleCloseSupplierModal}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
      >
        <SupplierForm />
      </Modal>
    </div>
  );
};

export default ChequesPage;
