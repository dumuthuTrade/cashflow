import React from 'react';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import DashboardMetrics from '../dashboard/DashboardMetrics';
import DashboardCharts from '../dashboard/DashboardCharts';
import UpcomingCheques from '../dashboard/UpcomingCheques';
import PendingCheques from '../dashboard/PendingCheques';

const Dashboard = () => {
  const metrics = useDashboardMetrics();  return (
    <div className="space-y-6">
      <PendingCheques />
      <DashboardMetrics metrics={metrics} />
      <DashboardCharts 
        cashFlowData={metrics.cashFlowData} 
        statusData={metrics.statusData} 
      />
      <UpcomingCheques upcomingCheques={metrics.upcomingCheques} />
    </div>
  );
};

export default Dashboard;
