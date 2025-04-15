import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getUserInstallments, payInstallment } from '../../services/api';
import { toast } from 'react-toastify';


const Installments = () => {
  const [installments, setInstallments] = useState([]); // Holds the raw data from API for the current page
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'paid'
  const [loading, setLoading] = useState(true);
  const [payingInstallmentId, setPayingInstallmentId] = useState(null); // Track which installment is being paid
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Or make this configurable
  const location = useLocation(); // Get the current location

  // Extract purchaseId from URL parameters
  const purchaseId = new URLSearchParams(location.search).get('purchaseId');

  // Fetch installments from API based on filter, page, and purchaseId
  const fetchInstallments = useCallback(async (page = 1, statusFilter = 'all') => {
    setLoading(true);
    setError(null);
    try {
      let isPaidFilter = null;
      if (statusFilter === 'paid') {
        isPaidFilter = true;
      } else if (statusFilter === 'pending') {
        isPaidFilter = false;
      }

      // Pass purchaseId to the API
      const data = await getUserInstallments(page, pageSize, isPaidFilter, null, 'due_date', 'asc');
      // Filter on the frontend if purchaseId is present
      const filteredInstallments = purchaseId
        ? data?.items?.filter(item => item.purchase_id === parseInt(purchaseId, 10)) || []
        : data?.items || [];

      setInstallments(filteredInstallments);
      setTotalPages(data?.total_pages || 1);
      setCurrentPage(data?.page || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch installments.');
      toast.error(err.message || 'Failed to fetch installments.');
      setInstallments([]); // Clear installments on error
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [pageSize, purchaseId]); // purchaseId is now a dependency

  // Initial fetch and fetch when filter, page, or purchaseId changes
  useEffect(() => {
    fetchInstallments(currentPage, filterStatus);
  }, [fetchInstallments, currentPage, filterStatus]);

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle paying an installment
  const handlePayInstallment = async (installmentId) => {
    setPayingInstallmentId(installmentId); // Indicate loading for this specific button
    try {
      await payInstallment(installmentId);
      toast.success('Installment paid successfully!');
      // Refresh the list to show the updated status
      fetchInstallments(currentPage, filterStatus);
    } catch (err) {
      toast.error(err.message || 'Failed to pay installment.');
    } finally {
      setPayingInstallmentId(null); // Reset loading indicator
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  // Render the main content area (loading, error, table, or no results)
  const renderContent = () => {
    if (loading && installments.length === 0) { // Show loading only on initial load or page change
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
          <button onClick={() => fetchInstallments(currentPage, filterStatus)} className="ml-4 px-2 py-1 bg-red-500 text-white rounded">Retry</button>
        </div>
      );
    }
    if (installments.length > 0) {
      return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Installment #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {installments.map(installment => (
                  <tr key={installment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{installment.purchase_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{installment.installment_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(installment.due_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(installment.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        installment.is_paid
                          ? 'bg-green-100 text-green-800'
                          : installment.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800' // Assuming 'pending' or similar if not paid and not overdue
                      }`}>
                        {installment.is_paid ? 'Paid' : installment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(installment.paid_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!installment.is_paid && (
                        <button
                          onClick={() => handlePayInstallment(installment.id)}
                          disabled={payingInstallmentId === installment.id}
                          className={`text-primary-600 hover:text-primary-900 disabled:opacity-50 disabled:cursor-not-allowed ${
                            payingInstallmentId === installment.id ? 'animate-pulse' : ''
                          }`}
                        >
                          {payingInstallmentId === installment.id ? 'Paying...' : 'Pay Now'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1 || loading}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <i className="bi bi-chevron-left h-5 w-5"></i>
                    </button>
                    {/* Add page number buttons here if needed */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || loading}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <i className="bi bi-chevron-right h-5 w-5"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    // No installments found for the current filter/page
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <i className="bi bi-journal-text text-gray-400 text-5xl"></i>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No installments found</h3>
        <p className="mt-2 text-sm text-gray-500">
          {filterStatus === 'all'
            ? "You don't have any installment plans yet."
            : filterStatus === 'pending'
            ? "You don't have any pending installment plans."
            : "You don't have any paid installment plans."}
        </p>
        {filterStatus !== 'all' && (
           <button
             onClick={() => handleFilterChange('all')}
             className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
           >
             Show All Installments
           </button>
        )}
      </div>
    );
  };


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Installments</h1>
        <p className="text-gray-600">Track and manage your installment plans</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${
              filterStatus === 'all'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${
              filterStatus === 'pending'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${
              filterStatus === 'paid'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleFilterChange('paid')}
          >
            Paid
          </button>
        </div>
      </div>


      {/* Render loading, error, or installment table */}
      {renderContent()}

      {/* Removed Payment History Section */}

    </div>
  );
};

export default Installments;
