import React from 'react';

const StatsCard = ({ title, value, icon, color, percentage, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          <i className={`bi ${icon} text-2xl`}></i>
        </div>
      </div>
      
      {percentage && (
        <div className="mt-4 flex items-center">
          <i className={`bi ${trend === 'up' ? 'bi-arrow-up' : 'bi-arrow-down'} text-${trend === 'up' ? 'green' : 'red'}-500 mr-1`}></i>
          <span className={`text-${trend === 'up' ? 'green' : 'red'}-500 text-sm font-medium`}>
            {percentage}%
          </span>
          <span className="text-gray-500 text-sm ml-1">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
