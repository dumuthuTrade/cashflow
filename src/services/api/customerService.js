import apiClient from './client';

/**
 * Customer API Service
 */
class CustomerService {
  /**
   * Get all customers with pagination and filtering
   */
  async getCustomers(params = {}) {
    const searchParams = new URLSearchParams();
    
    // Add query parameters
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    if (params.isActive !== undefined) searchParams.append('isActive', params.isActive);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/customers?${queryString}` : '/api/customers';
    
    const res = await apiClient.get(endpoint);    
    return res;
  }

  /**
   * Get single customer by ID
   */
  async getCustomer(id) {
    return apiClient.get(`/customers/${id}`);
  }

  /**
   * Create new customer
   */
  async createCustomer(customerData) {
    return apiClient.post('/customers', customerData);
  }

  /**
   * Update customer
   */
  async updateCustomer(id, customerData) {
    return apiClient.put(`/customers/${id}`, customerData);
  }

  /**
   * Delete customer
   */
  async deleteCustomer(id) {
    return apiClient.delete(`/customers/${id}`);
  }

  /**
   * Search customers for autocomplete
   */
  async searchCustomers(query) {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    return apiClient.get(`/customers/search?${searchParams.toString()}`);
  }
}

// Create singleton instance
const customerService = new CustomerService();

export default customerService;
