import React from 'react';
import { TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      </div>
      <Icon className={`h-8 w-8 text-${color}-600`} />
    </div>
  </div>
);

const DashboardMetrics = ({ metrics }) => {
  const { totalOutstanding, totalCleared, activeCheques } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title="Total Outstanding"
        value={formatCurrency(totalOutstanding)}
        icon={TrendingUp}
        color="orange"
      />
      <MetricCard
        title="Total Cleared"
        value={formatCurrency(totalCleared)}
        icon={TrendingDown}
        color="green"
      />
      <MetricCard
        title="Active Cheques"
        value={activeCheques}
        icon={Eye}
        color="blue"
      />
    </div>
  );
};

export default DashboardMetrics;
