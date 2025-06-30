import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { useAuthStore } from './store/authStore';
import { Suspense } from 'react';

// Pages
import LoginPage from './pages/LoginPage';
import CustomersPage from './pages/CustomerPage'; 
import SuppliersPage from './pages/SuppliersPage';
import ChecksPage from './pages/ChecksPage';

// Components
import LoadingSpinner from './components/atoms/LoadingSpinner';
import AppLayout from './components/templates/AppLayout/AppLayout';
import {AuthGuard} from './components/guards/AuthGuard';

// Auth route wrapper
const AuthRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner size="large" />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
              
              {/* Protected Routes with Layout */}
              <Route path="/" element={<AuthGuard><AppLayout /></AuthGuard>}>
                <Route path="dashboard" element={<div className="p-6 bg-white rounded-lg shadow-sm"><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="mt-2 text-gray-600">Welcome to CashFlow Dashboard</p></div>} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="suppliers" element={<SuppliersPage />} />
                <Route path="checks" element={<ChecksPage />} />
                <Route index element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
  );
}

export default App;