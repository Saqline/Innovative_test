import fetchWithAuth from '../api';

// Function to get a list of purchases (Admin only)
export const getPurchases = (page = 1, pageSize = 10, status = null, userId = null) => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (status) {
    params.append('status', status);
  }
  if (userId) {
    params.append('user_id', String(userId));
  }
  // Note: Ensure the backend endpoint matches '/api/v1/admin/purchases'
  return fetchWithAuth(`/api/v1/purchases/admin?${params.toString()}`);
};
