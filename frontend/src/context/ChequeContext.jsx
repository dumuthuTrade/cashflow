import React, { createContext, useContext, useState } from 'react';

const ChequeContext = createContext();

export const useChequeContext = () => {
  const context = useContext(ChequeContext);
  if (!context) {
    throw new Error('useChequeContext must be used within a ChequeProvider');
  }
  return context;
};

export const ChequeProvider = ({ children }) => {
  // Sample data - in real app this would come from MongoDB
  const [cheques, setCheques] = useState([
    {
      id: 1,
      chequeNumber: 'CHQ001',
      supplierId: 1,
      amount: 5000,
      issueDate: '2025-05-20',
      dueDate: '2025-05-30',
      status: 'issued',
      description: 'Office supplies payment'
    },
    {
      id: 2,
      chequeNumber: 'CHQ002',
      supplierId: 2,
      amount: 12000,
      issueDate: '2025-05-18',
      dueDate: '2025-05-28',
      status: 'cleared',
      description: 'Equipment purchase'
    },
    {
      id: 3,
      chequeNumber: 'CHQ003',
      supplierId: 3,
      amount: 8500,
      issueDate: '2025-05-22',
      dueDate: '2025-06-01',
      status: 'issued',
      description: 'Monthly inventory'
    },
    {
      id: 4,
      chequeNumber: 'CHQ004',
      supplierId: 1,
      amount: 3000,
      issueDate: '2025-05-10',
      dueDate: '2025-05-25',
      status: 'issued',
      description: 'Late payment fee'
    },
    {
      id: 5,
      chequeNumber: 'CHQ005',
      supplierId: 2,
      amount: 7000,
      issueDate: '2025-05-15',
      dueDate: '2025-05-20',
      status: 'issued',
      description: 'Cancelled order'
    }
  ]);

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'ABC Office Supplies', contact: '123-456-7890', accountNumber: 'ACC001' },
    { id: 2, name: 'TechCorp Equipment', contact: '098-765-4321', accountNumber: 'ACC002' },
    { id: 3, name: 'Global Inventory Ltd', contact: '555-123-4567', accountNumber: 'ACC003' }
  ]);

  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddCheque, setShowAddCheque] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [editingCheque, setEditingCheque] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [newCheque, setNewCheque] = useState({
    chequeNumber: '',
    supplierId: '',
    amount: '',
    issueDate: '',
    dueDate: '',
    status: 'issued',
    description: ''
  });
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    accountNumber: ''
  });

  // Helper functions
  const updateChequeStatus = (chequeId, newStatus) => {
    setCheques(cheques.map(cheque => 
      cheque.id === chequeId 
        ? { ...cheque, status: newStatus }
        : cheque
    ));
  };

  const value = {
    // State
    cheques,
    suppliers,
    currentView,
    showAddCheque,
    showAddSupplier,
    editingCheque,
    editingSupplier,
    newCheque,
    newSupplier,
      // Setters
    setCheques,
    setSuppliers,
    setCurrentView,
    setShowAddCheque,
    setShowAddSupplier,
    setEditingCheque,
    setEditingSupplier,
    setNewCheque,
    setNewSupplier,
    
    // Helper functions
    updateChequeStatus,
  };

  return (
    <ChequeContext.Provider value={value}>
      {children}
    </ChequeContext.Provider>
  );
};
