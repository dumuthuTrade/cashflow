import PropTypes from 'prop-types';

const AuthTemplate = ({ children, backgroundImage }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 opacity-90"></div>
        {backgroundImage && (
          <img
            className="w-full h-full object-cover"
            src={backgroundImage}
            alt="Background"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 sm:mx-auto sm:w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white">
            CashFlow Pro
          </h1>
          <p className="mt-2 text-blue-100">
            Take control of your financial future
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-blue-100">
            © 2025 CashFlow Pro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

AuthTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundImage: PropTypes.string,
};

export default AuthTemplate;
