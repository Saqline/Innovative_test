import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/admin/DataTable';
import { toast } from 'react-toastify';
import { getNotifications, createNotification } from '../../services/api/notifications';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  // Fetch notifications from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(
        pagination.page,
        pagination.size,
        userIdFilter || null
      );
      setNotifications(data.items || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0,
      }));
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(err.message || 'Failed to fetch notifications.');
      toast.error(err.message || 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, userIdFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Table columns
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
      Header: 'Message',
      accessor: 'message',
    },
    {
      Header: 'Notification Type',
      accessor: 'notification_type',
    },
    {
      Header: 'Is Read',
      accessor: 'is_read',
      Cell: ({ value }) => (value ? 'Yes' : 'No')
    },
  ], []);

  // Handle filter changes
  const handleUserIdFilterChange = (e) => {
    setUserIdFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

    // Handle add new notification
    const handleAddNew = () => {
      setCurrentNotification({
        user_id: '',
        message: '',
        notification_type: ''
      });
      setIsModalOpen(true);
    };

    // Handle form submit
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      if (!currentNotification?.user_id || !currentNotification?.message || !currentNotification?.notification_type) {
        toast.error('All fields are required');
        return;
      }

      try {
        await createNotification({
          user_id: parseInt(currentNotification.user_id),
          message: currentNotification.message,
          notification_type: currentNotification.notification_type
        });
        toast.success('Notification created');
        setIsModalOpen(false);
        setCurrentNotification(null);
        fetchData(); // Refresh data
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      }
    };

    // Handle input change
    const handleInputChange = (e) => {
      setCurrentNotification({
        ...currentNotification,
        [e.target.name]: e.target.value
      });
    };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notification Management</h1>
        <p className="text-gray-600">Create and manage notifications for users</p>
      </div>

      {/* Filtering Options */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Create Notification Button */}
      <div className="mb-4">
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Create New Notification
        </button>
      </div>

      {/* Notifications Table */}
      {loading ? (
        <div className="text-center py-10">Loading notifications...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">Error: {error}</div>
      ) : (
        <DataTable
          columns={columns}
          data={notifications}
          title="Notifications"
          filterPlaceholder="Search notifications..."
          currentPage={pagination.page}
          pageSize={pagination.size}
          totalItems={pagination.total}
          onPageChange={handlePageChange}
        />
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Notification</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="number"
                  name="user_id"
                  value={currentNotification?.user_id || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={currentNotification?.message || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </label>
                <input
                  type="text"
                  name="notification_type"
                  value={currentNotification?.notification_type || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
