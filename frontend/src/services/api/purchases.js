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
  return fetchWithAuth(`/api/v1/purchases/admin?${params.toString()}`);
};

// Function to get current user's purchases
export const getUserPurchases = (page = 1, pageSize = 10) => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  return fetchWithAuth(`/api/v1/purchases/me?${params.toString()}`);
};

// Function to send a notification for a specific purchase
export const sendPurchaseNotification = (purchaseId, message) => {
  return fetchWithAuth(`/api/v1/purchases/${purchaseId}/notify`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
};
