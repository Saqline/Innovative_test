import fetchWithAuth from '../api'; // Assuming fetchWithAuth remains in api.js

// Function to get a list of customers (Admin only)
export const getCustomers = (page = 1, pageSize = 10, sortBy = 'created_at', sortOrder = 'desc', name = null) => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  if (name) {
    params.append('name', name);
  }
  // Note: Ensure the backend endpoint matches '/api/v1/admin/customers'
  return fetchWithAuth(`/api/v1/users/admin/customers?${params.toString()}`);
};

// Function to delete a customer (Admin only)
export const deleteCustomer = (userId) => {
  // Note: Ensure the backend endpoint matches '/api/v1/admin/customers/{user_id}'
  return fetchWithAuth(`/api/v1/users/admin/customers/${userId}`, {
    method: 'DELETE',
  });
};

// Function to get current user details
export const getCurrentUser = () => {
    // Note: Ensure the backend endpoint matches '/api/v1/users/me'
    return fetchWithAuth('/api/v1/users/me');
};

// Add other user-related API functions if needed (e.g., update user profile, etc.)
