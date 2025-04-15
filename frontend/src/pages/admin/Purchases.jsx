 import React, { useState, useEffect, useCallback } from 'react';
 import { useNavigate } from 'react-router-dom'; // Import useNavigate
 import DataTable from '../../components/admin/DataTable';
 import { toast } from 'react-toastify';
 import { getPurchases } from '../../services/api/purchases'; // Import API function
 
 const Purchases = () => {
   const navigate = useNavigate(); // Initialize navigate
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  // Fetch purchases from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPurchases(
        pagination.page,
        pagination.size,
        statusFilter || null,
        userIdFilter || null
       );
       console.log("Received data:", data); // Keep console log for debugging if needed
       // API returns a direct array of purchases for the current page
       setPurchases(Array.isArray(data) ? data : []); 
       // Remove setting total from response as it's not provided
       // The DataTable will show total based on the current page's data length
     } catch (err) {
      console.error("Failed to fetch purchases:", err);
      setError(err.message || 'Failed to fetch purchases.');
      toast.error(err.message || 'Failed to fetch purchases.');
    } finally {
      setLoading(false);
    }
   }, [pagination.page, pagination.size, statusFilter, userIdFilter]);
 
   useEffect(() => {
     fetchData();
   }, [fetchData]);
 
   // Table columns definition (removed expander)
   const columns = React.useMemo(() => [
     {
       Header: 'ID',
      accessor: 'id',
    },
    {
      Header: 'User ID',
      accessor: 'user_id',
    },
    {
      Header: 'Product ID',
      accessor: 'product_id',
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
    },
    {
      Header: 'Total Amount',
      accessor: 'total_amount',
      Cell: ({ value }) => `$${value ? value.toFixed(2) : '0.00'}`
    },
    {
      Header: 'Paid Amount',
      accessor: 'paid_amount',
      Cell: ({ value }) => `$${value ? value.toFixed(2) : '0.00'}`
    },
    {
      Header: 'Due Amount',
      accessor: 'due_amount',
      Cell: ({ value }) => `$${value ? value.toFixed(2) : '0.00'}`
    },
    {
      Header: 'Number of Installments',
      accessor: 'number_of_installments',
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      Header: 'Updated At',
      accessor: 'updated_at',
       Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A'
     },
   ], []);
 
   // Handle row click to navigate to detail page
   const handleRowClick = (row) => {
     navigate(`/admin/purchases/${row.original.id}`, { state: { purchase: row.original } });
   };
 
   // Handle filter changes
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleUserIdFilterChange = (e) => {
    setUserIdFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchase Management</h1>
        <p className="text-gray-600">View and manage customer purchases</p>
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

      {/* Purchases Table */}
      {loading ? (
        <div className="text-center py-10">Loading purchases...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">Error: {error}</div>
      ) : (
        <DataTable
          columns={columns}
          data={purchases}
          title="Purchases"
          filterPlaceholder="Search purchases..."
          currentPage={pagination.page}
           pageSize={pagination.size}
           onPageChange={handlePageChange}
           // Pass the row click handler
           onRowClick={handleRowClick} 
         />
      )}
    </div>
  );
};

export default Purchases;
