import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import Button from '../../atoms/Button';
import PropTypes from 'prop-types';

const TransactionList = ({ 
  transactions = [], 
  isLoading = false,
  onEdit,
  onDelete,
  onAddNew,
  showActions = true 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'income':
        return '💰';
      case 'expense':
        return '💸';
      case 'transfer':
        return '🔄';
      default:
        return '📊';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'transfer':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
        {showActions && (
          <Button onClick={onAddNew} size="small">
            Add Transaction
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No transactions yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start tracking your cashflow by adding your first transaction
            </p>
            {showActions && (
              <Button onClick={onAddNew}>
                Add Your First Transaction
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Transaction Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="capitalize">{transaction.category}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>

                  {showActions && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => onEdit(transaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => onDelete(transaction.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination or Load More could go here */}
      {transactions.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {transactions.length} transactions
            </p>
            <Button variant="outline" size="small">
              Load More
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['income', 'expense', 'transfer']).isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['pending', 'completed', 'cancelled']).isRequired,
  })),
  isLoading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAddNew: PropTypes.func,
  showActions: PropTypes.bool,
};

export default TransactionList;
