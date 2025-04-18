import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/admin/DataTable';
import { toast } from 'react-toastify';
import { getCustomers, deleteCustomer } from '../../services/api/users';
import CreateCustomerModal from '../../components/admin/CreateCustomerModal';
import VerifyCustomerModal from '../../components/admin/VerifyCustomerModal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [customerToVerify, setCustomerToVerify] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10, // Corresponds to page_size in backend
    total: 0, // Will be fetched from API if available, otherwise calculated
  });
  // Add state for sorting if needed later
  // const [sorting, setSorting] = useState({ sortBy: 'created_at', sortOrder: 'desc' });

  // Table columns updated for backend data
  const columns = React.useMemo(() => [
    {
      Header: 'Customer',
      accessor: 'name',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {row.original.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      )
    },
    {
      Header: 'Phone',
      accessor: 'phone_number', // Use phone_number from backend
      Cell: ({ value }) => value || 'N/A' // Display N/A if null
    },
    // Removed Total Spent - Not available from backend
    // Removed Active Installments - Not available from backend
    {
      Header: 'Joined',
      accessor: 'created_at', // Use created_at from backend
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : 'N/A' // Format date
    },
    {
      Header: 'Verified',
      accessor: 'is_verified',
      Cell: ({ value, row }) => (
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {value ? 'Yes' : 'No'}
          </span>
          {!value && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVerifyClick(row.original);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Verify
            </button>
          )}
        </div>
      )
    },
    {
      Header: 'Status',
      accessor: 'is_active', // Use is_active from backend
      Cell: ({ value }) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          {/* View Link Removed as endpoint doesn't exist */}
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="text-red-600 hover:text-red-900"
            aria-label={`Delete customer ${row.original.name}`} // Accessibility improvement
          >
            Delete
          </button>
        </div>
      )
    }
  ], []); // Added React.useMemo hook
  
  // Handle delete click
  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete confirm - Updated to call API
  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;
    setLoading(true); // Indicate loading during delete
    try {
      await deleteCustomer(customerToDelete.id);
      toast.success(`Customer ${customerToDelete.name} has been deleted`);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
      // Refresh data, potentially adjusting page if last item on page deleted
      // Note: Backend doesn't return total count, so pagination adjustment is tricky.
      // We'll just refetch the current page for now.
      fetchData();
    } catch (err) {
      console.error("Failed to delete customer:", err);
      toast.error(`Error deleting customer: ${err.message}`);
      setLoading(false); // Reset loading on error
    }
    // setLoading(false) will be handled in fetchData's finally block
  };

  // Add verify click handler
  const handleVerifyClick = (customer) => {
    setCustomerToVerify(customer);
    setIsVerifyModalOpen(true);
  };

  // Fetching logic
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch customers for the current page/size
      // TODO: Add sorting parameters if implementing table sorting
      const customerData = await getCustomers(pagination.page, pagination.size);
      // Backend returns a list directly, not an object with 'items' and 'total'
      setCustomers(customerData || []);
      // Since backend doesn't return total, we can't implement accurate pagination controls easily.
      // We'll hide total/page count for now or assume the returned length is the total for the page.
      // setPagination(prev => ({ ...prev, total: customerData.total || 0 }));
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      const errorMsg = err.message || 'Failed to fetch customers';
      setError(errorMsg);
      toast.error(`Error: ${errorMsg}`);
      setCustomers([]); // Clear customers on error
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size]); // Add sorting state here if implemented

  // useEffect to call fetchData
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle pagination change
  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, page: 1, size: newSize }));
  };

  // Render loading state
  if (loading && customers.length === 0) {
    return <div className="text-center py-10">Loading customers...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center py-10 text-red-600">Error loading customers: {error}</div>;
  }


  return (
    <div>
      <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
       
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Customer
        </button>
      </div>
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-600">Manage your customer accounts and view their installment history</p>
      </div>

      {/* Customer Stats Removed - Data not available from current endpoint */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> ... </div> */}

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={customers}
        title="Customer List"
        filterPlaceholder="Search customers..."
        // Pass loading state if DataTable supports it
        // loading={loading}
      />

      {/* Basic Pagination Controls - Adjusted as total count is not available */}
       <div className="mt-4 flex justify-end items-center">
         {/* Removed total count display */}
         {/* <span>Page {pagination.page} ({customers.length} items shown)</span> */}
         <div>
           <button
             onClick={() => handlePageChange(pagination.page - 1)}
             disabled={pagination.page <= 1 || loading}
             className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Previous
           </button>
           <span className="mx-2">Page {pagination.page}</span>
           <button
             onClick={() => handlePageChange(pagination.page + 1)}
             // Disable 'Next' if the current page has fewer items than page size,
             // indicating it might be the last page. This is an approximation.
             disabled={customers.length < pagination.size || loading}
             className="ml-2 px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Next
           </button>
           {/* Page size selector */}
           <select
             value={pagination.size}
             onChange={(e) => handleSizeChange(Number(e.target.value))}
             disabled={loading}
             className="ml-4 p-1 border rounded disabled:opacity-50"
           >
             <option value={10}>10 per page</option>
             <option value={25}>25 per page</option>
             <option value={50}>50 per page</option>
           </select>
         </div>
       </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i className="bi bi-exclamation-triangle text-red-600"></i>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Customer
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {customerToDelete?.name}? All of their data will be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     {/* Create Customer Modal */}
      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchData();
          setIsCreateModalOpen(false);
        }}
      />
      {/* Add verify modal */}
      <VerifyCustomerModal
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setCustomerToVerify(null);
        }}
        customerEmail={customerToVerify?.email}
        onSuccess={() => {
          fetchData();
          setIsVerifyModalOpen(false);
          setCustomerToVerify(null);
        }}
      />
    </div>
  );
};

export default Customers;
