import React from 'react';

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-primary-100 text-primary-600">
            <i className="bi bi-credit-card text-2xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Installments</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.activeInstallments}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <i className="bi bi-check-circle text-2xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Completed Payments</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.completedPayments}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <i className="bi bi-calendar-event text-2xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Upcoming Payments</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.upcomingPayments}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <i className="bi bi-exclamation-triangle text-2xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Overdue Payments</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.overduePayments}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
