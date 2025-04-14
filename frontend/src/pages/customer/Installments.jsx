import React, { useState, useEffect, useCallback } from 'react';
import InstallmentCard from '../../components/customer/InstallmentCard';
import { getUserInstallments } from '../../services/api'; // Import API function
import { toast } from 'react-toastify';

const Installments = () => {
  const [installments, setInstallments] = useState([]); // Holds the raw data from API for the current page
  const [filteredInstallments, setFilteredInstallments] = useState([]); // Holds installments after frontend filtering/sorting
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch installments from API
  const fetchInstallments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserInstallments();
      setInstallments(data?.items || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch installments.');
      toast.error(err.message || 'Failed to fetch installments.');
      setInstallments([]); // Clear installments on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, fetchInstallments itself doesn't change

  // Initial fetch and fetch on page change
  useEffect(() => {
    fetchInstallments();
  }, [fetchInstallments]);

  // Filter installments whenever raw installments or filters change
  useEffect(() => {
    let result = [...installments]; // Start with the raw data for the current page

    // Filter by active tab
    if (activeTab !== 'all') {
      result = result.filter(installment =>
        (activeTab === 'active' && installment.is_paid === false) ||
        (activeTab === 'completed' && installment.is_paid === true) ||
        (activeTab === 'overdue' && installment.status === 'overdue')
      );
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(installment =>
        installment.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInstallments(result);
  }, [installments, activeTab, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to render the main content area (loading, error, installments, or no results)
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <i className="bi bi-arrow-repeat text-4xl text-primary-600 animate-spin"></i>
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      );
    }
    if (filteredInstallments.length > 0) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstallments.map(installment => (
              <InstallmentCard key={installment.id} installment={installment} />
            ))}
          </div>
        </>
      );
    }
    // No installments found after filtering
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <i className="bi bi-search text-gray-400 text-5xl"></i>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No installments found</h3>
        <p className="mt-2 text-sm text-gray-500">
          {searchTerm
            ? "No installments match your search criteria."
            : activeTab === 'all'
            ? "You don't have any installment plans yet."
            : activeTab === 'active'
            ? "You don't have any active installment plans."
            : activeTab === 'completed'
            ? "You don't have any completed installment plans."
            : "You don't have any overdue installment plans."}
        </p>
        <button
          onClick={() => {
            setActiveTab('all');
            setSearchTerm('');
          }}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Reset Filters
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Installments</h1>
        <p className="text-gray-600">Track and manage your installment plans</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleTabChange('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleTabChange('active')}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'completed'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleTabChange('completed')}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'overdue'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleTabChange('overdue')}
              >
                Overdue
              </button>
            </div>
            <div className="mt-4 md:mt-0 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-search text-gray-400"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search installments..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Render loading, error, or installment grid */}
      {renderContent()}

      {/* Payment History Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
{installments.map(installment => (
                    <tr key={installment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={installment.product?.image_url || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product"}
                              alt={installment.product?.name}
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{installment.product?.name}</div>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(installment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${installment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          installment.is_paid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {installment.is_paid ? 'completed' : 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Installments;
