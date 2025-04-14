import React, { useState } from 'react';
import StatsCard from '../../components/admin/StatsCard';
import DashboardChart from '../../components/admin/DashboardChart';
import DataTable from '../../components/admin/DataTable';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  
  // Mock data for stats
  const stats = {
    totalSales: {
      value: '$24,500',
      percentage: 12,
      trend: 'up',
      icon: 'bi-currency-dollar',
      color: 'primary'
    },
    activeInstallments: {
      value: '156',
      percentage: 8,
      trend: 'up',
      icon: 'bi-credit-card',
      color: 'secondary'
    },
    totalCustomers: {
      value: '1,245',
      percentage: 5,
      trend: 'up',
      icon: 'bi-people',
      color: 'accent'
    },
    overduePayments: {
      value: '23',
      percentage: 2,
      trend: 'down',
      icon: 'bi-exclamation-triangle',
      color: 'red'
    }
  };
  
  // Mock data for charts
  const salesData = {
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Sales',
          data: [1200, 1900, 1500, 2500, 1800, 2800, 2200],
          backgroundColor: 'rgba(14, 165, 233, 0.2)',
          borderColor: 'rgba(14, 165, 233, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Sales',
          data: [12000, 19000, 15000, 25000, 18000, 28000, 22000, 24000, 27000, 32000, 28000, 35000],
          backgroundColor: 'rgba(14, 165, 233, 0.2)',
          borderColor: 'rgba(14, 165, 233, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    }
  };
  
  const installmentData = {
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'New Installments',
          data: [5, 8, 12, 7, 10, 15, 9],
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderRadius: 6
        }
      ]
    },
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'New Installments',
          data: [45, 58, 72, 67, 80, 95, 89, 92, 87, 102, 98, 110],
          backgroundColor: 'rgba(139, 92, 246, 0.8)',
          borderRadius: 6
        }
      ]
    }
  };
  
  const paymentStatusData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 10
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          }
        }
      }
    },
    cutout: '70%'
  };
  
  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      customer: 'John Doe',
      product: 'Samsung Galaxy S21',
      amount: 300,
      date: '2023-11-28',
      status: 'completed'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      product: 'MacBook Air M1',
      amount: 450,
      date: '2023-11-27',
      status: 'completed'
    },
    {
      id: 3,
      customer: 'Robert Johnson',
      product: 'Sony PlayStation 5',
      amount: 150,
      date: '2023-11-26',
      status: 'pending'
    },
    {
      id: 4,
      customer: 'Emily Davis',
      product: 'Apple iPad Pro',
      amount: 250,
      date: '2023-11-25',
      status: 'completed'
    },
    {
      id: 5,
      customer: 'Michael Wilson',
      product: 'Dell XPS 13',
      amount: 375,
      date: '2023-11-24',
      status: 'overdue'
    }
  ];
  
  // Table columns for recent transactions
  const transactionColumns = [
    {
      Header: 'Customer',
      accessor: 'customer',
    },
    {
      Header: 'Product',
      accessor: 'product',
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ({ value }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : value === 'pending' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      Header: 'Action',
      Cell: () => (
        <button className="text-primary-600 hover:text-primary-900">
          View
        </button>
      )
    }
  ];
  
  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin! Here's what's happening with your store today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => handleTimeRangeChange('weekly')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                timeRange === 'weekly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => handleTimeRangeChange('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                timeRange === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Sales" 
          value={stats.totalSales.value} 
          icon={stats.totalSales.icon} 
          color={stats.totalSales.color} 
          percentage={stats.totalSales.percentage} 
          trend={stats.totalSales.trend} 
        />
        <StatsCard 
          title="Active Installments" 
          value={stats.activeInstallments.value} 
          icon={stats.activeInstallments.icon} 
          color={stats.activeInstallments.color} 
          percentage={stats.activeInstallments.percentage} 
          trend={stats.activeInstallments.trend} 
        />
        <StatsCard 
          title="Total Customers" 
          value={stats.totalCustomers.value} 
          icon={stats.totalCustomers.icon} 
          color={stats.totalCustomers.color} 
          percentage={stats.totalCustomers.percentage} 
          trend={stats.totalCustomers.trend} 
        />
        <StatsCard 
          title="Overdue Payments" 
          value={stats.overduePayments.value} 
          icon={stats.overduePayments.icon} 
          color={stats.overduePayments.color} 
          percentage={stats.overduePayments.percentage} 
          trend={stats.overduePayments.trend} 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <DashboardChart 
            type="line" 
            data={salesData[timeRange]} 
            options={lineChartOptions} 
            title={`Sales Overview (${timeRange === 'weekly' ? 'This Week' : 'This Year'})`} 
          />
        </div>
        <div>
          <DashboardChart 
            type="doughnut" 
            data={paymentStatusData} 
            options={doughnutChartOptions} 
            title="Payment Status" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardChart 
          type="bar" 
          data={installmentData[timeRange]} 
          options={barChartOptions} 
          title={`New Installments (${timeRange === 'weekly' ? 'This Week' : 'This Year'})`} 
        />
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Due Payments</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-calendar-event text-yellow-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Robert Johnson - Sony PlayStation 5</p>
                  <p className="text-xs text-gray-500">Due in 2 days</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">$150.00</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-calendar-event text-yellow-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Sarah Thompson - iPhone 13 Pro</p>
                  <p className="text-xs text-gray-500">Due in 3 days</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">$200.00</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-calendar-event text-yellow-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">David Miller - LG OLED TV</p>
                  <p className="text-xs text-gray-500">Due in 5 days</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">$350.00</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Michael Wilson - Dell XPS 13</p>
                  <p className="text-xs text-gray-500">Overdue by 3 days</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">$375.00</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link 
              to="/admin/installments" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All Due Payments
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="mb-8">
        <DataTable 
          columns={transactionColumns} 
          data={recentTransactions} 
          title="Recent Transactions" 
          filterPlaceholder="Search transactions..." 
        />
      </div>
    </div>
  );
};

export default Dashboard;
