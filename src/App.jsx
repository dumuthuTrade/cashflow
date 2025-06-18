import React, { useState } from 'react';
import Navigation from './components/layout/Navigation';
import Dashboard from './components/pages/Dashboard';
import ChequesPage from './components/pages/ChequesPage';
import SuppliersPage from './components/pages/SuppliersPage';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'cheques':
        return <ChequesPage />;
      case 'suppliers':
        return <SuppliersPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default App;