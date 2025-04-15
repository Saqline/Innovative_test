import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/admin/DataTable';
import { toast } from 'react-toastify';
import { getInstallments, updateInstallment } from '../../services/api'; // Import API function
// import { payInstallment } from '../../services/api/installments'; // Remove this import

const Installments = () => {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [installmentToRemind, setInstallmentToRemind] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState('');
  const [isPaidFilter, setIsPaidFilter] = useState(null);
  const [userIdFilter, setUserIdFilter] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  // Fetch installments from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInstallments(
        pagination.page,
        pagination.size,
        statusFilter || null, // Pass null for no filter
        isPaidFilter,
        userIdFilter || null, // Pass null for no filter
        "due_date",
        "desc"
      );
      setInstallments(data.items || []);
      setPagination(prev => ({
        ...prev,
        total: data.total,
      }));
    } catch (err) {
      console.error("Failed to fetch installments:", err);
      setError(err.message || 'Failed to fetch installments.');
      toast.error(err.message || 'Failed to fetch installments.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, statusFilter, isPaidFilter, userIdFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Table columns (map to backend InstallmentResponse schema)
  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'Purchase ID',
      accessor: 'purchase_id',
    },
    {
      Header: 'Installment No',
      accessor: 'installment_no',
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ({ value }) => `$${value ? value.toFixed(2) : '0.00'}`
    },
    {
      Header: 'Due Date',
      accessor: 'due_date',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      Header: 'Is Paid',
      accessor: 'is_paid',
      Cell: ({ value }) => value ? 'Yes' : 'No'
    },
    {
      Header: 'Paid Date',
      accessor: 'paid_date',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handlePaymentClick(row.original)}
            className="text-primary-600 hover:text-primary-900"
          >
            Record Payment
          </button>
        </div>
      ),
    },
  ], []);

  // Handle payment click
  const handlePaymentClick = (installment) => {
    setSelectedInstallment(installment);
    setPaymentAmount(installment.amount.toFixed(2)); // Use installment.amount
    setIsPaymentModalOpen(true);
  };

  // Handle payment submit
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!selectedInstallment) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedInstallment.amount) { // Use installment.amount
      toast.error('Please enter a valid payment amount');
      return;
    }

    try {
      // Call the backend API to record the payment
      // Assuming you have a payInstallment API function
      await updateInstallment(selectedInstallment.id, { is_paid: true });
      toast.success(`Payment of $${amount.toFixed(2)} recorded successfully`);
      setIsPaymentModalOpen(false);
      setSelectedInstallment(null);
      setPaymentAmount('');
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Failed to pay installment:", err);
      toast.error(`Failed to record payment: ${err.message}`);
    }
  };

  // Handle filter changes
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset page
  };

  const handleIsPaidFilterChange = (e) => {
    const value = e.target.value === '' ? null : e.target.value === 'true';
    setIsPaidFilter(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset page
  };

  const handleUserIdFilterChange = (e) => {
    setUserIdFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset page
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Installment Management</h1>
        <p className="text-gray-600">Track and manage customer installment plans</p>
      </div>

      {/* Filtering Options */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="statusFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label htmlFor="isPaidFilter" className="block text-sm font-medium text-gray-700">Is Paid</label>
            <select
              id="isPaidFilter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={isPaidFilter === null ? '' : isPaidFilter}
              onChange={handleIsPaidFilterChange}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label htmlFor="userIdFilter" className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="number"
              id="userIdFilter"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              placeholder="Enter User ID"
              value={userIdFilter}
              onChange={handleUserIdFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Installments Table */}
      {loading ? (
        <div className="text-center py-10">Loading installments...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">Error: {error}</div>
      ) : (
        <DataTable
          columns={columns}
          data={installments}
          title="Installments"
          filterPlaceholder="Search installments..."
          currentPage={pagination.page}
          pageSize={pagination.size}
          totalItems={pagination.total}
          onPageChange={handlePageChange}
        />
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedInstallment && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i className="bi bi-credit-card text-primary-600"></i>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Record Payment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Record payment for installment ID {selectedInstallment.id}.
                      </p>
                      <form onSubmit={handlePaymentSubmit} className="mt-4">
                        <div>
                          <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                            Payment Amount
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="paymentAmount"
                              id="paymentAmount"
                              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                              step="0.01"
                              min="0.01"
                              max={selectedInstallment.amount}
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">USD</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Record Payment
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Installments;
