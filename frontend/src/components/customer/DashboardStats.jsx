import React, { useState, useEffect } from 'react';
import { getInstallmentStats } from '../../services/api/installments'; // Import the service function

const LoadingCard = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-gray-200 h-12 w-12"></div>
      <div className="ml-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInstallmentStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => <LoadingCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mb-8">{error}</div>;
  }

  if (!stats) {
    return null; // Or some placeholder if stats are null after loading
  }

  // Define stats cards data
  const statsCards = [
    { title: "Total Installments", value: stats.total, icon: "bi-list-ol", color: "primary" },
    { title: "Paid Installments", value: stats.paid, icon: "bi-check-circle-fill", color: "green" },
    { title: "Pending Installments", value: stats.pending, icon: "bi-hourglass-split", color: "yellow" },
    { title: "Overdue Installments", value: stats.overdue, icon: "bi-exclamation-triangle-fill", color: "red" },
  ];

  // Helper function to get Tailwind classes based on color
  const getColorClasses = (color) => {
    switch (color) {
      case 'primary': return { border: 'border-primary-500', bg: 'bg-primary-100', text: 'text-primary-600' };
      case 'green': return { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-600' };
      case 'yellow': return { border: 'border-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'red': return { border: 'border-red-500', bg: 'bg-red-100', text: 'text-red-600' };
      default: return { border: 'border-gray-500', bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((card, index) => {
        const colors = getColorClasses(card.color);
        return (
          <div key={index} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${colors.border}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${colors.bg} ${colors.text}`}>
                <i className={`bi ${card.icon} text-2xl`}></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
