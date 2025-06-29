// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction types
export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  category: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense' | 'transfer';
  amount: string | number;
  description: string;
  category: string;
  date: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  userId: string;
}

// Cashflow summary types
export interface CashflowSummary {
  totalIncome: number;
  totalExpenses: number;
  netCashflow: number;
  period: string;
  transactions: Transaction[];
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// Filter types
export interface TransactionFilters {
  type?: 'income' | 'expense' | 'transfer';
  category?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
