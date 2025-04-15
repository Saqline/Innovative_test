import { API_BASE_URL } from '../config';

// Helper function to get the auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : null;
};

// Generic fetch function with authentication
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON
      errorData = { message: `HTTP error! status: ${response.status}` };
    }
    // Throw an error object compatible with existing error handling
    const error = new Error(errorData?.detail?.message || errorData?.message || `HTTP error! status: ${response.status}`);
    if (response.status === 403 && errorData?.detail?.require_verification) {
        error.requireVerification = true;
        error.email = errorData.detail.email;
    }
    throw error;
  }

  // Handle 204 No Content response
  if (response.status === 204) {
    return null; 
  }

  return response.json();
};

// Specific API functions (moved product functions to api/products.js)
export const getUserPurchases = (page = 1, pageSize = 10) => {
  const params = new URLSearchParams({ page, page_size: pageSize });
  return fetchWithAuth(`/api/v1/purchases/me?${params.toString()}`);
};

// Updated getUserInstallments to support pagination and status filtering
export const getUserInstallments = (page = 1, pageSize = 10, isPaid = null, status = null, sortBy = 'due_date', sortOrder = 'desc') => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    sort_by: sortBy,
    sort_order: sortOrder,
  });
  if (isPaid !== null) {
    params.append('is_paid', String(isPaid));
  }
  if (status) {
    params.append('status', status);
  }
  return fetchWithAuth(`/api/v1/installments/me?${params.toString()}`);
};


// Function to get a single product by its ID
export const getProductById = (productId) => {
  return fetchWithAuth(`/api/v1/products/${productId}`);
};

// Add other API functions as needed (e.g., createPurchase, payInstallment)

// Function to create a new purchase
export const createPurchase = (purchaseData) => {
  return fetchWithAuth('/api/v1/purchases/', {
    method: 'POST',
    body: JSON.stringify(purchaseData),
  });
};

// Function to pay an installment (replaces updateInstallment)
export const payInstallment = (installmentId) => {
  // The backend endpoint doesn't require a request body for paying
  return fetchWithAuth(`/api/v1/installments/${installmentId}/pay`, {
    method: 'PATCH',
  });
};


// Function to get installments (Admin only)
export const getInstallments = (page = 1, pageSize = 10, status = null, isPaid = null, userId = null, sortBy = 'due_date', sortOrder = 'desc') => {
  const params = new URLSearchParams({
    page: String(page),
  });
  if (status) {
    params.append('status', status);
  }
  if (isPaid !== null) {
    params.append('is_paid', String(isPaid));
  }
  if (userId) {
    params.append('user_id', String(userId));
  }
  // Note: Ensure the backend endpoint matches '/api/v1/admin/installments'
  return fetchWithAuth(`/api/v1/installments/admin?${params.toString()}`);
};

export default fetchWithAuth;
