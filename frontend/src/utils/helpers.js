export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'issued': return 'bg-yellow-100 text-yellow-800';
    case 'cleared': return 'bg-green-100 text-green-800';
    case 'bounced': return 'bg-red-100 text-red-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getSupplierName = (suppliers, supplierId) => {
  const supplier = suppliers.find(s => s.id === supplierId);
  return supplier ? supplier.name : 'Unknown Supplier';
};

export const exportToCSV = (cheques, suppliers) => {
  const headers = ['Cheque Number', 'Supplier', 'Amount', 'Issue Date', 'Due Date', 'Status', 'Description'];
  const csvData = cheques.map(c => [
    c.chequeNumber,
    getSupplierName(suppliers, c.supplierId),
    c.amount,
    c.issueDate,
    c.dueDate,
    c.status,
    c.description
  ]);

  const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cheques-report.csv';
  a.click();
};
