import { useState, useEffect, useCallback } from 'react';
import Button from '../components/atoms/Button';
import Table from '../components/molecules/Table/Table';
import Modal from '../components/molecules/Modal/Modal';
import SupplierForm from '../components/molecules/SupplierForm/SupplierForm';
import Pagination from '../components/molecules/Pagination/Pagination';
import SearchInput from '../components/molecules/SearchInput/SearchInput';
import ErrorBoundary from '../components/ErrorBoundary';
import supplierService from '../services/api/supplierService';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const itemsPerPage = 10;

  // Define table columns
  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (value) => (
        <div className="text-sm font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      render: (value) => (
        <div className="text-sm text-gray-600">{value || '-'}</div>
      )
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (value) => (
        <div className="text-sm text-gray-600">{value || '-'}</div>
      )
    },
    {
      key: 'contactPerson',
      title: 'Contact Person',
      render: (value) => (
        <div className="text-sm text-gray-600">{value || '-'}</div>
      )
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  // Fetch suppliers
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (activeFilter !== 'all') {
        params.isActive = activeFilter === 'active';
      }

      const response = await supplierService.getSuppliers(params);
      
      if (response.status === 'success') {
        setSuppliers(response.data.suppliers || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalItems(response.data.pagination?.total || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch suppliers');
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err.message || 'Failed to fetch suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, activeFilter]);

  // Load suppliers on mount and when dependencies change
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle create supplier
  const handleCreateSupplier = () => {
    console.log('Add Supplier clicked');
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  // Handle edit supplier
  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  // Handle delete supplier
  const handleDeleteSupplier = async (supplier) => {
    if (!window.confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await supplierService.deleteSupplier(supplier._id);
      
      if (response.status === 'success') {
        await fetchSuppliers(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to delete supplier');
      }
    } catch (err) {
      console.error('Error deleting supplier:', err);
      alert(err.message || 'Failed to delete supplier');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      let response;
      if (editingSupplier) {
        response = await supplierService.updateSupplier(editingSupplier._id, formData);
      } else {
        response = await supplierService.createSupplier(formData);
      }
      
      if (response.status === 'success') {
        setIsModalOpen(false);
        setEditingSupplier(null);
        await fetchSuppliers(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to save supplier');
      }
    } catch (err) {
      console.error('Error saving supplier:', err);
      alert(err.message || 'Failed to save supplier');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <p className="text-gray-600">Manage your suppliers and their information</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchSuppliers}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <SearchInput
            placeholder="Search suppliers..."
            onSearch={handleSearch}
            className="flex-1 max-w-md"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('active')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeFilter === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleFilterChange('inactive')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeFilter === 'inactive'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
        
        <Button onClick={handleCreateSupplier}>
          Add Supplier
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={suppliers}
          loading={loading}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
        />
        
        {/* Pagination */}
        {!loading && suppliers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        size="medium"
        className="z-[9999]"
      >
        <ErrorBoundary>
          <SupplierForm
            supplier={editingSupplier}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
            loading={formLoading}
          />
        </ErrorBoundary>
      </Modal>
    </div>
  );
};

export default SuppliersPage;