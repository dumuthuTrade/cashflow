import apiClient from './client';

/**
 * Cheque API Service
 */
class ChequeService {
  /**
   * Get all cheques with pagination and filtering
   */
  async getCheques(params = {}) {
    const searchParams = new URLSearchParams();
    
    // Add query parameters
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.type) searchParams.append('type', params.type);
    if (params.transactionType) searchParams.append('transactionType', params.transactionType);
    if (params.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) searchParams.append('dateTo', params.dateTo);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/cheques?${queryString}` : '/api/cheques';
    
    const res = await apiClient.get(endpoint);    
    return res;
  }

  /**
   * Get single cheque by ID
   */
  async getCheque(id) {
    return apiClient.get(`/cheques/${id}`);
  }

  /**
   * Create new cheque
   */
  async createCheque(chequeData) {
    console.log('Creating cheque with data:', chequeData);
    
    return apiClient.post('/cheques', chequeData);
  }

  /**
   * Update cheque
   */
  async updateCheque(id, chequeData) {
    return apiClient.put(`/cheques/${id}`, chequeData);
  }

  /**
   * Delete cheque
   */
  async deleteCheque(id) {
    return apiClient.delete(`/cheques/${id}`);
  }

  /**
   * Get dashboard statistics
   */
  async getStats() {
    return apiClient.get('/cheques/stats');
  }

  /**
   * Update cheque status with history
   */
  async updateChequeStatus(id, status, notes = '') {
    return apiClient.patch(`/cheques/${id}/status`, { status, notes });
  }
}

// Create singleton instance
const chequeService = new ChequeService();

export default chequeService;
