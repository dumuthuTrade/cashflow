import { useMemo } from 'react';
import { useChequeContext } from '../context/ChequeContext';

export const useDashboardMetrics = () => {
  const { cheques } = useChequeContext();

  const metrics = useMemo(() => {
    const totalIssued = cheques.filter(c => c.status === 'issued').reduce((sum, c) => sum + c.amount, 0);
    const totalCleared = cheques.filter(c => c.status === 'cleared').reduce((sum, c) => sum + c.amount, 0);
    const totalOutstanding = cheques.filter(c => ['issued', 'bounced'].includes(c.status)).reduce((sum, c) => sum + c.amount, 0);

    // Get upcoming cheques (next 7 days)
    const upcomingCheques = cheques.filter(c => {
      const dueDate = new Date(c.dueDate);
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= nextWeek && c.status === 'issued';
    });

    const statusData = [
      { name: 'Issued', value: cheques.filter(c => c.status === 'issued').length, color: '#f59e0b' },
      { name: 'Cleared', value: cheques.filter(c => c.status === 'cleared').length, color: '#10b981' },
      { name: 'Bounced', value: cheques.filter(c => c.status === 'bounced').length, color: '#ef4444' },
      { name: 'Cancelled', value: cheques.filter(c => c.status === 'cancelled').length, color: '#6b7280' }
    ];

    const cashFlowData = [
      { month: 'Jan', issued: 45000, cleared: 42000 },
      { month: 'Feb', issued: 52000, cleared: 48000 },
      { month: 'Mar', issued: 38000, cleared: 41000 },
      { month: 'Apr', issued: 61000, cleared: 58000 },
      { month: 'May', issued: 25500, cleared: 12000 }
    ];

    return {
      totalIssued,
      totalCleared,
      totalOutstanding,
      upcomingCheques,
      statusData,
      cashFlowData,
      activeCheques: cheques.filter(c => c.status === 'issued').length
    };
  }, [cheques]);

  return metrics;
};
