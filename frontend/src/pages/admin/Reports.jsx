import React, { useState } from 'react';
import DashboardChart from '../../components/admin/DashboardChart';
import DataTable from '../../components/admin/DataTable';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [timeRange, setTimeRange] = useState('weekly');
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
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
  
  const paymentData = {
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Payments Received',
          data: [800, 1200, 950, 1500, 1100, 1800, 1400],
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Due Payments',
          data: [400, 700, 550, 1000, 700, 1000, 800],
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          borderColor: 'rgba(249, 115, 22, 1)',
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
          label: 'Payments Received',
          data: [8000, 12000, 9500, 15000, 11000, 18000, 14000, 16000, 18000, 21000, 19000, 23000],
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Due Payments',
          data: [4000, 7000, 5500, 10000, 7000, 10000, 8000, 9000, 11000, 11000, 9000, 12000],
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          borderColor: 'rgba(249, 115, 22, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    }
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
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
  
  // Mock data for tables
  const salesReportData = [
    { id: 1, date: '2023-11-28', customer: 'John Doe', product: 'Samsung Galaxy S21', amount: 1200, paymentMethod: 'Credit Card' },
    { id: 2, date: '2023-11-27', customer: 'Jane Smith', product: 'MacBook Air M1', amount: 1800, paymentMethod: 'Debit Card' },
    { id: 3, date: '2023-11-26', customer: 'Robert Johnson', product: 'Sony PlayStation 5', amount: 600, paymentMethod: 'Bank Transfer' },
    { id: 4, date: '2023-11-25', customer: 'Emily Davis', product: 'Apple iPad Pro', amount: 1000, paymentMethod: 'Credit Card' },
    { id: 5, date: '2023-11-24', customer: 'Michael Wilson', product: 'Dell XPS 13', amount: 1500, paymentMethod: 'PayPal' },
    { id: 6, date: '2023-11-23', customer: 'Sarah Thompson', product: 'iPhone 13 Pro', amount: 1100, paymentMethod: 'Credit Card' },
    { id: 7, date: '2023-11-22', customer: 'David Miller', product: 'LG OLED TV', amount: 2200, paymentMethod: 'Bank Transfer' },
    { id: 8, date: '2023-11-21', customer: 'Jessica Brown', product: 'Bose QuietComfort 45', amount: 350, paymentMethod: 'Credit Card' }
  ];
  
  const installmentReportData = [
    { id: 1, customer: 'John Doe', product: 'Samsung Galaxy S21', totalAmount: 1200, paidAmount: 800, remainingAmount: 400, nextDueDate: '2023-12-15', status: 'pending' },
    { id: 2, customer: 'John Doe', product: 'MacBook Air M1', totalAmount: 1800, paidAmount: 900, remainingAmount: 900, nextDueDate: '2023-12-20', status: 'pending' },
    { id: 3, customer: 'Jane Smith', product: 'Sony PlayStation 5', totalAmount: 600, paidAmount: 150, remainingAmount: 450, nextDueDate: '2023-12-05', status: 'overdue' },
    { id: 4, customer: 'Emily Davis', product: 'Apple iPad Pro', totalAmount: 1000, paidAmount: 1000, remainingAmount: 0, nextDueDate: null, status: 'paid' },
    { id: 5, customer: 'Michael Wilson', product: 'Dell XPS 13', totalAmount: 1500, paidAmount: 375, remainingAmount: 1125, nextDueDate: '2023-11-25', status: 'overdue' },
    { id: 6, customer: 'Sarah Thompson', product: 'iPhone 13 Pro', totalAmount: 1100, paidAmount: 275, remainingAmount: 825, nextDueDate: '2023-12-10', status: 'pending' },
    { id: 7, customer: 'David Miller', product: 'LG OLED TV', totalAmount: 2200, paidAmount: 550, remainingAmount: 1650, nextDueDate: '2023-12-12', status: 'pending' }
  ];
  
  const paymentReportData = [
    { id: 1, date: '2023-11-28', customer: 'John Doe', product: 'Samsung Galaxy S21', amount: 300, installmentNumber: 3, status: 'completed' },
    { id: 2, date: '2023-11-27', customer: 'Jane Smith', product: 'MacBook Air M1', amount: 450, installmentNumber: 2, status: 'completed' },
    { id: 3, date: '2023-11-26', customer: 'Robert Johnson', product: 'Sony PlayStation 5', amount: 150, installmentNumber: 1, status: 'completed' },
    { id: 4, date: '2023-11-25', customer: 'Emily Davis', product: 'Apple iPad Pro', amount: 250, installmentNumber: 4, status: 'completed' },
    { id: 5, date: '2023-11-24', customer: 'Michael Wilson', product: 'Dell XPS 13', amount: 375, installmentNumber: 1, status: 'completed' },
    { id: 6, date: '2023-11-23', customer: 'Sarah Thompson', product: 'iPhone 13 Pro', amount: 275, installmentNumber: 1, status: 'completed' },
    { id: 7, date: '2023-11-22', customer: 'David Miller', product: 'LG OLED TV', amount: 550, installmentNumber: 1, status: 'completed' },
    { id: 8, date: '2023-11-21', customer: 'Jessica Brown', product: 'Bose QuietComfort 45', amount: 350, installmentNumber: 1, status: 'completed' }
  ];
  
  // Table columns
  const salesReportColumns = [
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({ value }) => new Date(value).toLocaleDateString()
    },
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
      Header: 'Payment Method',
      accessor: 'paymentMethod',
    }
  ];
  
  const installmentReportColumns = [
    {
      Header: 'Customer',
      accessor: 'customer',
    },
    {
      Header: 'Product',
      accessor: 'product',
    },
    {
      Header: 'Total Amount',
      accessor: 'totalAmount',
      Cell: ({ value }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Paid Amount',
      accessor: 'paidAmount',
      Cell: ({ value }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Remaining',
      accessor: 'remainingAmount',
      Cell: ({ value }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Next Due Date',
      accessor: 'nextDueDate',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'paid' 
            ? 'bg-green-100 text-green-800' 
            : value === 'pending' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    }
  ];
  
  const paymentReportColumns = [
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({ value }) => new Date(value).toLocaleDateString()
    },
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
      Header: 'Installment',
      accessor: 'installmentNumber',
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
    }
  ];
  
  // Get chart data based on report type and time range
  const getChartData = () => {
    switch (reportType) {
      case 'sales':
        return salesData[timeRange];
      case 'installments':
        return installmentData[timeRange];
      case 'payments':
        return paymentData[timeRange];
      default:
        return salesData[timeRange];
    }
  };
  
  // Get table data based on report type
  const getTableData = () => {
    switch (reportType) {
      case 'sales':
        return salesReportData;
      case 'installments':
        return installmentReportData;
      case 'payments':
        return paymentReportData;
      default:
        return salesReportData;
    }
  };
  
  // Get table columns based on report type
  const getTableColumns = () => {
    switch (reportType) {
      case 'sales':
        return salesReportColumns;
      case 'installments':
        return installmentReportColumns;
      case 'payments':
        return paymentReportColumns;
      default:
        return salesReportColumns;
    }
  };
  
  // Get report title based on report type
  const getReportTitle = () => {
    switch (reportType) {
      case 'sales':
        return 'Sales Report';
      case 'installments':
        return 'Installment Report';
      case 'payments':
        return 'Payment Report';
      default:
        return 'Report';
    }
  };
  
  // Handle report type change
  const handleReportTypeChange = (type) => {
    setReportType(type);
  };
  
  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };
  
  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };
  
  // Handle export report
  const handleExportReport = (format) => {
    // In a real app, this would generate and download the report
    alert(`Exporting ${reportType} report in ${format} format`);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600">Generate and view reports on sales, installments, and payments</p>
      </div>
      
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleReportTypeChange('sales')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  reportType === 'sales'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Sales
              </button>
              <button
                type="button"
                onClick={() => handleReportTypeChange('installments')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  reportType === 'installments'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Installments
              </button>
              <button
                type="button"
                onClick={() => handleReportTypeChange('payments')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  reportType === 'payments'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Payments
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleTimeRangeChange('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
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
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  timeRange === 'monthly'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Date Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="startDate" className="sr-only">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={handleDateChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="sr-only">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={handleDateChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <div className="dropdown relative inline-block">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <i className="bi bi-download mr-2"></i>
              Export Report
              <i className="bi bi-chevron-down ml-2"></i>
            </button>
            <div className="dropdown-content hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  onClick={() => handleExportReport('pdf')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  <i className="bi bi-file-pdf mr-2"></i>
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExportReport('excel')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  <i className="bi bi-file-excel mr-2"></i>
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExportReport('csv')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  <i className="bi bi-file-text mr-2"></i>
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {reportType === 'sales' 
              ? '$10,500.00' 
              : reportType === 'installments' 
              ? '$9,400.00' 
              : '$2,350.00'}
          </p>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 text-sm font-medium flex items-center">
              <i className="bi bi-arrow-up mr-1"></i>
              12.5%
            </span>
            <span className="text-gray-500 text-sm ml-2">vs. previous period</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">
            {reportType === 'sales' 
              ? 'Total Orders' 
              : reportType === 'installments' 
              ? 'Active Installments' 
              : 'Total Payments'}
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {reportType === 'sales' 
              ? '8' 
              : reportType === 'installments' 
              ? '7' 
              : '8'}
          </p>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 text-sm font-medium flex items-center">
              <i className="bi bi-arrow-up mr-1"></i>
              8.3%
            </span>
            <span className="text-gray-500 text-sm ml-2">vs. previous period</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500">
            {reportType === 'sales' 
              ? 'Average Order Value' 
              : reportType === 'installments' 
              ? 'Average Installment Value' 
              : 'Average Payment'}
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {reportType === 'sales' 
              ? '$1,312.50' 
              : reportType === 'installments' 
              ? '$1,342.86' 
              : '$293.75'}
          </p>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 text-sm font-medium flex items-center">
              <i className="bi bi-arrow-up mr-1"></i>
              3.8%
            </span>
            <span className="text-gray-500 text-sm ml-2">vs. previous period</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {reportType === 'sales' 
            ? `Sales Overview (${timeRange === 'weekly' ? 'This Week' : 'This Year'})` 
            : reportType === 'installments' 
            ? `Installments Overview (${timeRange === 'weekly' ? 'This Week' : 'This Year'})` 
            : `Payments Overview (${timeRange === 'weekly' ? 'This Week' : 'This Year'})`}
        </h3>
        <div className="h-80">
          <DashboardChart 
            type={reportType === 'installments' ? 'bar' : 'line'} 
            data={getChartData()} 
            options={chartOptions} 
            title="" 
          />
        </div>
      </div>
      
      {/* Report Table */}
      <DataTable 
        columns={getTableColumns()} 
        data={getTableData()} 
        title={getReportTitle()} 
        filterPlaceholder={`Search ${reportType}...`} 
      />
    </div>
  );
};

export default Reports;
