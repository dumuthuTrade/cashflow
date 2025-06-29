import Button from '../../atoms/Button';
import LoginForm from '../../molecules/LoginForm/LoginForm';
import RegisterForm from '../../molecules/RegisterForm/RegisterForm';
import PropTypes from 'prop-types';

const AuthCard = ({ 
  mode = 'login', 
  onToggleMode, 
  onLogin, 
  onRegister,
  isLoading = false,
  error = null 
}) => {
  const isLoginMode = mode === 'login';

  const handleSubmit = (formData) => {
    if (isLoginMode) {
      onLogin(formData);
    } else {
      onRegister(formData);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLoginMode ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-blue-100">
              {isLoginMode 
                ? 'Sign in to manage your cashflow' 
                : 'Join us to track your finances'
              }
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {isLoginMode ? (
            <LoginForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
            />
          ) : (
            <RegisterForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              {isLoginMode 
                ? "Don't have an account?" 
                : "Already have an account?"
              }
            </p>
            <Button
              variant="outline"
              onClick={onToggleMode}
              className="w-full"
              disabled={isLoading}
            >
              {isLoginMode ? 'Create Account' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

AuthCard.propTypes = {
  mode: PropTypes.oneOf(['login', 'register']),
  onToggleMode: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

export default AuthCard;
