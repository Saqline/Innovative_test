import fetchWithAuth from '../api';

export const getAdminDashboardStats = async () => {
  try {
    const response = await fetchWithAuth('/api/v1/admin/stats/dashboard');
    return response;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
};