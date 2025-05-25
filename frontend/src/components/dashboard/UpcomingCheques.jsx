import React from 'react';
import { AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, getSupplierName } from '../../utils/helpers';
import { useChequeContext } from '../../context/ChequeContext';

const UpcomingCheques = ({ upcomingCheques }) => {
  const { suppliers } = useChequeContext();

  if (upcomingCheques.length === 0) return null;

  return (
    <>
      {/* Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <h3 className="text-sm font-medium text-yellow-800">
            {upcomingCheques.length} cheque(s) due in the next 7 days
          </h3>
        </div>
        <div className="mt-2 text-sm text-yellow-700">
          Total amount: {formatCurrency(upcomingCheques.reduce((sum, c) => sum + c.amount, 0))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Upcoming Cheques (Next 7 Days)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cheque #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingCheques.map((cheque) => (
                <tr key={cheque.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cheque.chequeNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSupplierName(suppliers, cheque.supplierId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(cheque.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(cheque.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UpcomingCheques;
