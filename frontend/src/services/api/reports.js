import fetchWithAuth from '../api';

// Function to generate admin report
export const generateReport = (startDate, endDate) => {
  const params = new URLSearchParams({
    start_date_str: startDate,
    end_date_str: endDate,
  });
  // Note: Ensure the backend endpoint matches '/api/v1/reports/'
  return fetchWithAuth(`/api/v1/reports/?${params.toString()}`);
};
