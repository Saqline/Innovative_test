import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/admin/StatsCard';
import DashboardChart from '../../components/admin/DashboardChart';
import { getAdminDashboardStats } from '../../services/api/admin';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return null;

  // Prepare data for stats cards
  const statsCardsData = {
    totalSales: {
      value: `$${(stats.income_stats.total_paid_amount + 
              stats.income_stats.total_pending_amount + 
              stats.income_stats.total_overdue_amount).toFixed(2)}`,
      percentage: ((stats.income_stats.total_paid_amount / 
                  (stats.income_stats.total_paid_amount + 
                   stats.income_stats.total_pending_amount + 
                   stats.income_stats.total_overdue_amount)) * 100).toFixed(1),
      trend: 'up',
      icon: 'bi-currency-dollar',
      color: 'primary'
    },
    activeInstallments: {
      value: stats.total_installments.toString(),
      percentage: ((stats.installments_stats.paid_count / stats.total_installments) * 100).toFixed(1),
      trend: 'up',
      icon: 'bi-credit-card',
      color: 'secondary'
    },
    totalProducts: {
      value: stats.total_products.toString(),
      percentage: ((stats.total_purchases / stats.total_products) * 100).toFixed(1),
      trend: 'up',
      icon: 'bi-box',
      color: 'accent'
    },
    paidPayments: {
      value: stats.installments_stats.paid_count.toString(),
      percentage: ((stats.installments_stats.paid_count / stats.total_installments) * 100).toFixed(1),
      trend: 'down',
      icon: 'bi-exclamation-triangle',
      color: 'red'
    },
    duePayments: {
      value: stats.installments_stats.pending_count.toString(),
      percentage: ((stats.installments_stats.pending_count / stats.total_installments) * 100).toFixed(1),
      trend: 'down',
      icon: 'bi-exclamation-triangle',
      color: 'red'
    }
  };

  // Prepare data for payment status doughnut chart
  const paymentStatusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      data: [
        stats.installments_stats.paid_count,
        stats.installments_stats.pending_count,
        stats.installments_stats.overdue_count
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  // Prepare data for income distribution chart
  const incomeDistributionData = {
    labels: ['Paid Amount', 'Pending Amount', 'Overdue Amount'],
    datasets: [{
      label: 'Income Distribution',
      data: [
        stats.income_stats.total_paid_amount,
        stats.income_stats.total_pending_amount,
        stats.income_stats.total_overdue_amount
      ],
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      borderColor: 'rgba(14, 165, 233, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  };

  // Chart options
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Sales" 
          value={statsCardsData.totalSales.value}
          icon={statsCardsData.totalSales.icon}
          color={statsCardsData.totalSales.color}
          percentage={statsCardsData.totalSales.percentage}
          trend={statsCardsData.totalSales.trend}
        />
        <StatsCard 
          title="Total Installments"
          value={statsCardsData.activeInstallments.value}
          icon={statsCardsData.activeInstallments.icon}
          color={statsCardsData.activeInstallments.color}
          percentage={statsCardsData.activeInstallments.percentage}
          trend={statsCardsData.activeInstallments.trend}
        />
        <StatsCard 
          title="Total Products"
          value={statsCardsData.totalProducts.value}
          icon={statsCardsData.totalProducts.icon}
          color={statsCardsData.totalProducts.color}
          percentage={statsCardsData.totalProducts.percentage}
          trend={statsCardsData.totalProducts.trend}
        />
        <StatsCard 
          title="Paid Payments"
          value={statsCardsData.paidPayments.value}
          icon={statsCardsData.paidPayments.icon}
          color={statsCardsData.paidPayments.color}
          percentage={statsCardsData.paidPayments.percentage}
          trend={statsCardsData.paidPayments.trend}
        />
        <StatsCard 
          title="Due Payments"
          value={statsCardsData.duePayments.value}
          icon={statsCardsData.duePayments.icon}
          color={statsCardsData.duePayments.color}
          percentage={statsCardsData.duePayments.percentage}
          trend={statsCardsData.duePayments.trend}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardChart 
          type="line"
          data={incomeDistributionData}
          options={lineChartOptions}
          title="Income Distribution"
        />
        <DashboardChart 
          type="doughnut"
          data={paymentStatusData}
          options={doughnutChartOptions}
          title="Payment Status Distribution"
        />
      </div>
    </div>
  );
};

export default Dashboard;
