import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Filter, X, Plus } from 'lucide-react';
import { useChequeContext } from '../../context/ChequeContext';
import { useSupplierActions } from '../../hooks/useSupplierActions';

const ChequeFilters = ({ onFiltersChange, filteredCount, totalCount, filters }) => {
  const { suppliers, setShowAddSupplier } = useChequeContext();
  const { handleAddSupplierFromName } = useSupplierActions();
  const [showFilters, setShowFilters] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  // Sync supplier search with the selected supplier filter
  useEffect(() => {
    if (filters.supplier) {
      const supplier = suppliers.find(s => s.id === parseInt(filters.supplier));
      if (supplier) {
        setSupplierSearch(supplier.name);
      }
    } else {
      setSupplierSearch('');
    }
  }, [filters.supplier, suppliers]);

  // Filter suppliers based on search
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearch) return suppliers;
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(supplierSearch.toLowerCase())
    );
  }, [suppliers, supplierSearch]);
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      dueDateFrom: '',
      dueDateTo: '',
      status: '',
      supplier: ''
    };
    setSupplierSearch('');
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const handleSupplierSelect = (supplier) => {
    setSupplierSearch(supplier.name);
    handleFilterChange('supplier', supplier.id);
    setShowSupplierDropdown(false);
  };

  const handleSupplierInputChange = (e) => {
    const value = e.target.value;
    setSupplierSearch(value);
    setShowSupplierDropdown(true);
    
    // If input is cleared, clear the supplier filter
    if (value === '') {
      handleFilterChange('supplier', '');
    }
  };
  const handleAddNewSupplier = () => {
    if (supplierSearch.trim()) {
      // Add the supplier with just the name
      const newSupplier = handleAddSupplierFromName(supplierSearch.trim());
      // Set it as the selected supplier in the filter
      handleFilterChange('supplier', newSupplier.id);
      setShowSupplierDropdown(false);
    } else {
      // Open the supplier form modal for full details
      setShowAddSupplier(true);
      setShowSupplierDropdown(false);
    }
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === parseInt(supplierId));
    return supplier ? supplier.name : '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                Active
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredCount} of {totalCount} cheques
        </div>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Due Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date From
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.dueDateFrom}
                  onChange={(e) => handleFilterChange('dueDateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Due Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date To
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.dueDateTo}
                  onChange={(e) => handleFilterChange('dueDateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="issued">Issued</option>
                <option value="cleared">Cleared</option>
                <option value="bounced">Bounced</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Supplier Filter with Autocomplete */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={supplierSearch}
                  onChange={handleSupplierInputChange}
                  onFocus={() => setShowSupplierDropdown(true)}
                  onBlur={() => {
                    // Delay to allow click on dropdown items
                    setTimeout(() => setShowSupplierDropdown(false), 200);
                  }}
                  placeholder="Search suppliers..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {/* Dropdown */}
                {showSupplierDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {/* Add New Supplier Option */}
                    {supplierSearch && !filteredSuppliers.some(s => s.name.toLowerCase() === supplierSearch.toLowerCase()) && (
                      <button
                        onClick={handleAddNewSupplier}
                        className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add "{supplierSearch}" as new supplier
                      </button>
                    )}
                    
                    {/* Existing Suppliers */}
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <button
                          key={supplier.id}
                          onClick={() => handleSupplierSelect(supplier)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        >
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-xs text-gray-500">{supplier.contact}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No suppliers found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {filters.dueDateFrom && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                From: {filters.dueDateFrom}
                <button
                  onClick={() => handleFilterChange('dueDateFrom', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.dueDateTo && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                To: {filters.dueDateTo}
                <button
                  onClick={() => handleFilterChange('dueDateTo', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.supplier && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Supplier: {getSupplierName(filters.supplier)}
                <button
                  onClick={() => {
                    handleFilterChange('supplier', '');
                    setSupplierSearch('');
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChequeFilters;
