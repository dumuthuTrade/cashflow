import { useChequeContext } from '../context/ChequeContext';

export const useChequeActions = () => {
  const {
    cheques,
    setCheques,
    newCheque,
    setNewCheque,
    editingCheque,
    setEditingCheque,
    setShowAddCheque
  } = useChequeContext();

  const handleAddCheque = () => {
    if (newCheque.chequeNumber && newCheque.supplierId && newCheque.amount) {
      const cheque = {
        ...newCheque,
        id: Date.now(),
        amount: parseFloat(newCheque.amount),
        supplierId: parseInt(newCheque.supplierId)
      };
      setCheques([...cheques, cheque]);
      resetChequeForm();
      setShowAddCheque(false);
    }
  };

  const handleEditCheque = (cheque) => {
    setEditingCheque(cheque);
    setNewCheque(cheque);
    setShowAddCheque(true);
  };

  const handleUpdateCheque = () => {
    setCheques(cheques.map(c => 
      c.id === editingCheque.id 
        ? { ...newCheque, amount: parseFloat(newCheque.amount) } 
        : c
    ));
    setEditingCheque(null);
    resetChequeForm();
    setShowAddCheque(false);
  };

  const handleDeleteCheque = (id) => {
    setCheques(cheques.filter(c => c.id !== id));
  };

  const resetChequeForm = () => {
    setNewCheque({
      chequeNumber: '',
      supplierId: '',
      amount: '',
      issueDate: '',
      dueDate: '',
      status: 'issued',
      description: ''
    });
  };

  return {
    handleAddCheque,
    handleEditCheque,
    handleUpdateCheque,
    handleDeleteCheque,
    resetChequeForm
  };
};
