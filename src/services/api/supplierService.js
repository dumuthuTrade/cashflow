import apiClient from './client';

/**
 * Supplier API Service
 */
class SupplierService {
  /**
   * Get all suppliers with pagination and filtering
   */
  async getSuppliers(params = {}) {
    const searchParams = new URLSearchParams();
    
    // Add query parameters
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    if (params.isActive !== undefined) searchParams.append('isActive', params.isActive);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/suppliers?${queryString}` : '/api/suppliers';
    
    const res = await apiClient.get(endpoint);    
    return res;
  }

  /**
   * Get single supplier by ID
   */
  async getSupplier(id) {
    return apiClient.get(`/suppliers/${id}`);
  }

  /**
   * Create new supplier
   */
  async createSupplier(supplierData) {
    return apiClient.post('/suppliers', supplierData);
  }

  /**
   * Update supplier
   */
  async updateSupplier(id, supplierData) {
    return apiClient.put(`/suppliers/${id}`, supplierData);
  }

  /**
   * Delete supplier
   */
  async deleteSupplier(id) {
    return apiClient.delete(`/suppliers/${id}`);
  }

  /**
   * Search suppliers for autocomplete
   */
  async searchSuppliers(query) {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    return apiClient.get(`/suppliers/search?${searchParams.toString()}`);
  }
}

// Create singleton instance
const supplierService = new SupplierService();

export default supplierService;
