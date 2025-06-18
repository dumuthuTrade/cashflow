import { useChequeContext } from '../context/ChequeContext';

export const useSupplierActions = () => {
  const {
    suppliers,
    setSuppliers,
    newSupplier,
    setNewSupplier,
    editingSupplier,
    setEditingSupplier,
    setShowAddSupplier
  } = useChequeContext();
  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.contact) {
      const supplier = {
        ...newSupplier,
        id: Date.now()
      };
      setSuppliers([...suppliers, supplier]);
      resetSupplierForm();
      setShowAddSupplier(false);
      return supplier; // Return the new supplier for potential use
    }
  };

  const handleAddSupplierFromName = (supplierName) => {
    const supplier = {
      name: supplierName,
      contact: '',
      accountNumber: '',
      id: Date.now()
    };
    setSuppliers([...suppliers, supplier]);
    return supplier;
  };

  const handleUpdateSupplier = () => {
    setSuppliers(suppliers.map(s => 
      s.id === editingSupplier.id ? { ...newSupplier } : s
    ));
    setEditingSupplier(null);
    resetSupplierForm();
    setShowAddSupplier(false);
  };

  const handleDeleteSupplier = (id) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const resetSupplierForm = () => {
    setNewSupplier({ name: '', contact: '', accountNumber: '' });
  };
  return {
    handleAddSupplier,
    handleAddSupplierFromName,
    handleUpdateSupplier,
    handleDeleteSupplier,
    resetSupplierForm
  };
};
