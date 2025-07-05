import { useState, useEffect, useCallback } from 'react';
import Button from '../components/atoms/Button';
import Table from '../components/molecules/Table/Table';
import Modal from '../components/molecules/Modal/Modal';
import ChequeForm from '../components/molecules/CheckForm/CheckForm';
import ChequeStatusModal from '../components/molecules/ChequeStatusModal/ChequeStatusModal';
import Pagination from '../components/molecules/Pagination/Pagination';
import SearchInput from '../components/molecules/SearchInput/SearchInput';
import ErrorBoundary from '../components/ErrorBoundary';
import chequeService from '../services/api/chequeService';

const ChequesPage = () => {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingCheque, setEditingCheque] = useState(null);
  const [statusCheque, setStatusCheque] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const itemsPerPage = 10;

  // Define table columns
  const columns = [
    {
      key: 'chequeNumber',
      title: 'Cheque #',
      render: (value) => (
        <div className="text-sm font-medium text-gray-900">{value || 'N/A'}</div>
      )
    },
    {
      key: 'type',
      title: 'Type',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'issued' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'}
        </span>
      )
    },
    {
      key: 'chequeDetails',
      title: 'Amount',
      render: (value) => (
        <div className="text-sm font-medium text-gray-900">
          ${value?.amount ? parseFloat(value.amount).toFixed(2) : '0.00'}
        </div>
      )
    },
    {
      key: 'chequeDetails',
      title: 'Cheque Date',
      render: (value) => (
        <div className="text-sm text-gray-600">
          {value?.chequeDate ? new Date(value.chequeDate).toLocaleDateString() : '-'}
        </div>
      )
    },
    {
      key: 'relatedTransaction',
      title: 'Transaction Type',
      render: (value) => (
        <div className="text-sm text-gray-600">
          <div>{value?.transactionType || '-'}</div>
          {value?.transactionId && (
            <div className="text-xs text-gray-500">ID: {value.transactionId.substring(0, 8)}...</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value, row) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          deposited: 'bg-blue-100 text-blue-800',
          cleared: 'bg-green-100 text-green-800',
          bounced: 'bg-red-100 text-red-800',
          cancelled: 'bg-gray-100 text-gray-800'
        };
        
        return (
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              statusColors[value] || 'bg-gray-100 text-gray-800'
            }`}>
              {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'}
            </span>
            <button
              onClick={() => handleUpdateStatus(row)}
              className="text-blue-600 hover:text-blue-800 text-xs underline"
              title="Update status"
            >
              Update
            </button>
          </div>
        );
      }
    }
  ];

  // Fetch cheques
  const fetchCheques = useCallback(async () => {
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
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      const response = await chequeService.getCheques(params);
      
      if (response.status === 'success') {
        setCheques(response.data.cheques || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalItems(response.data.pagination?.total || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch cheques');
      }
    } catch (err) {
      console.error('Error fetching cheques:', err);
      setError(err.message || 'Failed to fetch cheques');
      setCheques([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  // Load cheques on mount and when dependencies change
  useEffect(() => {
    fetchCheques();
  }, [fetchCheques]);

  // Handle search
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle filter change
  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleTypeFilterChange = (filter) => {
    setTypeFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle create cheque
  const handleCreateCheque = () => {
    console.log('Add Cheque clicked');
    setEditingCheque(null);
    setIsModalOpen(true);
  };

  // Handle edit cheque
  const handleEditCheque = (cheque) => {
    setEditingCheque(cheque);
    setIsModalOpen(true);
  };

  // Handle delete cheque
  const handleDeleteCheque = async (cheque) => {
    const chequeIdentifier = cheque.chequeNumber || cheque._id?.substring(0, 8) || 'this cheque';
    if (!window.confirm(`Are you sure you want to delete ${chequeIdentifier}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await chequeService.deleteCheque(cheque._id);
      
      if (response.status === 'success') {
        await fetchCheques(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to delete cheque');
      }
    } catch (err) {
      console.error('Error deleting cheque:', err);
      alert(err.message || 'Failed to delete cheque');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    
    try {
      setFormLoading(true);
      
      let response;
      if (editingCheque) {
        response = await chequeService.updateCheque(editingCheque._id, formData);
      } else {
        console.log('Creating new cheque with data:', formData);
        
        response = await chequeService.createCheque(formData);
        console.log();
        
      }
      
      if (response.status === 'success') {
        setIsModalOpen(false);
        setEditingCheque(null);
        await fetchCheques(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to save cheque');
      }
    } catch (err) {
      console.error('Error saving cheque:', err);
      alert(err.message || 'Failed to save cheque');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle status update
  const handleUpdateStatus = (cheque) => {
    setStatusCheque(cheque);
    setIsStatusModalOpen(true);
  };

  // Handle status submission
  const handleStatusSubmit = async (chequeId, status, notes) => {
    try {
      setStatusLoading(true);
      const response = await chequeService.updateChequeStatus(chequeId, status, notes);
      
      if (response.status === 'success') {
        setIsStatusModalOpen(false);
        setStatusCheque(null);
        await fetchCheques(); // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.message || 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCheque(null);
  };

  // Handle status modal close
  const handleStatusModalClose = () => {
    setIsStatusModalOpen(false);
    setStatusCheque(null);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'bg-blue-100 text-blue-700' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'deposited', label: 'Deposited', color: 'bg-blue-100 text-blue-700' },
    { value: 'cleared', label: 'Cleared', color: 'bg-green-100 text-green-700' },
    { value: 'bounced', label: 'Bounced', color: 'bg-red-100 text-red-700' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-700' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types', color: 'bg-purple-100 text-purple-700' },
    { value: 'issued', label: 'Issued', color: 'bg-blue-100 text-blue-700' },
    { value: 'received', label: 'Received', color: 'bg-green-100 text-green-700' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cheques</h1>
        <p className="text-gray-600">Manage your cheques and track their status</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchCheques}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <SearchInput
            placeholder="Search cheques..."
            onSearch={handleSearch}
            className="flex-1 max-w-md"
          />
          
          <Button onClick={handleCreateCheque}>
            Add Cheque
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 self-center">Status:</span>
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleStatusFilterChange(option.value)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  statusFilter === option.value
                    ? option.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 self-center">Type:</span>
            {typeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleTypeFilterChange(option.value)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  typeFilter === option.value
                    ? option.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={cheques}
          loading={loading}
          onEdit={handleEditCheque}
          onDelete={handleDeleteCheque}
        />
        
        {/* Pagination */}
        {!loading && cheques.length > 0 && (
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
        title={editingCheque ? 'Edit Cheque' : 'Add New Cheque'}
        size="large"
        className="z-[9999]"
      >
        <ErrorBoundary>
          <h3 className="font-bold">{editingCheque ? 'Edit Cheque' : 'Add New Cheque'}</h3>
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="w-full max-w-3xl h-[90vh] overflow-y-auto shadow-lg rounded-lg p-6">
          <ChequeForm
            cheque={editingCheque}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
            loading={formLoading}
          />
          </div>
          </div>
        </ErrorBoundary>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={handleStatusModalClose}
        title="Update Cheque Status"
        size="small"
        className="z-[9999]"
      >
        <ErrorBoundary>
          <ChequeStatusModal
            cheque={statusCheque}
            onSubmit={handleStatusSubmit}
            onCancel={handleStatusModalClose}
            loading={statusLoading}
          />
        </ErrorBoundary>
      </Modal>
    </div>
  );
};

export default ChequesPage;