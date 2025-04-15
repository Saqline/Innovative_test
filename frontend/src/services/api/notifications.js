import fetchWithAuth from '../api';

// Function to get a list of notifications (Admin only)
export const getNotifications = (page = 1, size = 10, userId = null) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  if (userId) {
    params.append('user_id', String(userId));
  }
  // Note: Ensure the backend endpoint matches '/api/v1/notifications/'
  return fetchWithAuth(`/api/v1/notifications/?${params.toString()}`);
};

// Function to create a new notification (Admin only)
export const createNotification = (notificationData) => {
  return fetchWithAuth('/api/v1/notifications/', {
    method: 'POST',
    body: JSON.stringify(notificationData),
  });
};
