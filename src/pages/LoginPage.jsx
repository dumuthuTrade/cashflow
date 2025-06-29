import { useState } from 'react';
import LoginForm from '../components/molecules/LoginForm/LoginForm';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const { login, isLoading, error } = useAuthStore();
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      setLoginError('');
      await login(credentials);
      // Redirect to dashboard or handle success
    } catch (err) {
      setLoginError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your cashflow with ease
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          {(error || loginError) && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error || loginError}
            </div>
          )}
          
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
