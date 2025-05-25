import React from 'react';

const Navigation = ({ currentView, setCurrentView }) => {

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cheques', label: 'Cheques' },
    { id: 'suppliers', label: 'Suppliers' }
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold text-gray-900">Cheque Tracker</h1>
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === item.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
