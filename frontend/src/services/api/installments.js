import fetchWithAuth from '../api'; // Import the default fetchWithAuth function

export const getInstallmentStats = async () => {
  try {
    // Use fetchWithAuth directly, ensuring the correct path prefix
    const data = await fetchWithAuth('/api/v1/installments/stats'); 
    return data; // fetchWithAuth already parses JSON
  } catch (error) {
    console.error('Error fetching installment stats:', error);
    throw error;
  }
};

// Add other installment-related API functions here if needed
// e.g., getInstallments, payInstallment
