import { useState, useEffect, useCallback } from 'react';
import Button from '../components/atoms/Button';
import Table from '../components/molecules/Table/Table';
import Modal from '../components/molecules/Modal/Modal';
import CustomerForm from '../components/molecules/CustomerForm/CustomerForm';
import Pagination from '../components/molecules/Pagination/Pagination';
import SearchInput from '../components/molecules/SearchInput/SearchInput';
import ErrorBoundary from '../components/ErrorBoundary';
import customerService from '../services/api/customerService';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
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
      key: 'customerCode',
      title: 'Code',
      render: (value) => (
        <div className="text-sm font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'personalInfo.name',
      title: 'Name',
      render: (value, record) => (
        <div className="text-sm font-medium text-gray-900">{record.personalInfo?.name}</div>
      )
    },
    {
      key: 'personalInfo.email',
      title: 'Email',
      render: (value, record) => (
        <div className="text-sm text-gray-600">{record.personalInfo?.email || '-'}</div>
      )
    },
    {
      key: 'personalInfo.phone',
      title: 'Phone',
      render: (value, record) => (
        <div className="text-sm text-gray-600">{record.personalInfo?.phone || '-'}</div>
      )
    },
    {
      key: 'creditProfile.rating',
      title: 'Credit Rating',
      render: (value, record) => (
        <div className="text-sm text-gray-600">{record.creditProfile?.rating || '-'}</div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
          value === 'active'
            ? 'bg-green-100 text-green-800' 
            : value === 'suspended'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
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
        params.status = activeFilter;
      }

      const response = await customerService.getCustomers(params);
      
      if (response.status === 'success') {
        setCustomers(response.data.customers || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalItems(response.data.pagination?.total || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch customers');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, activeFilter]);

  // Load customers on mount and when dependencies change
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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

  // Handle create customer
  const handleCreateCustomer = () => {
    console.log('Add Customer clicked');
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  // Handle delete customer
  const handleDeleteCustomer = async (customer) => {
    if (!window.confirm(`Are you sure you want to delete "${customer.personalInfo?.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await customerService.deleteCustomer(customer._id);
      
      if (response.status === 204) {
        await fetchCustomers(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to delete customer');
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert(err.message || 'Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      let response;
      if (editingCustomer) {
        response = await customerService.updateCustomer(editingCustomer._id, formData);
      } else {
        response = await customerService.createCustomer(formData);
      }
      
      if (response.status === 'success') {
        setIsModalOpen(false);
        setEditingCustomer(null);
        await fetchCustomers(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to save customer');
      }
    } catch (err) {
      console.error('Error saving customer:', err);
      alert(err.message || 'Failed to save customer');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your customers and their information</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchCustomers}
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
            placeholder="Search customers..."
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
            <button
              onClick={() => handleFilterChange('suspended')}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                activeFilter === 'suspended'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Suspended
            </button>
          </div>
        </div>
        
        <Button onClick={handleCreateCustomer}>
          Add Customer
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={customers}
          loading={loading}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
        />
        
        {/* Pagination */}
        {!loading && customers.length > 0 && (
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
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        size="large"
        className="z-[9999]"
      >
        <ErrorBoundary>
          <h3 className="font-bold">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="w-full max-w-3xl h-[90vh] overflow-y-auto shadow-lg rounded-lg p-6">
                <CustomerForm
                  customer={editingCustomer}
                  onSubmit={handleFormSubmit}
                  onCancel={handleModalClose}
                  loading={formLoading}
                />
            </div>
          </div>

        </ErrorBoundary>
      </Modal>
    </div>
  );
};

export default CustomersPage;