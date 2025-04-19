import fetchWithAuth from '../api';

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
  return fetchWithAuth(`/api/v1/users/admin/customers?${params.toString()}`);
};

export const deleteCustomer = (userId) => {
  return fetchWithAuth(`/api/v1/users/admin/customers/${userId}`, {
    method: 'DELETE',
  });
};

export const getCurrentUser = () => {
  return fetchWithAuth('/api/v1/users/me');
};

export const createCustomer = (customerData) => {
  return fetchWithAuth('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });
};

export const createCustomerAdmin = (customerData) => {
  return fetchWithAuth('/api/v1/auth/register-admin', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });
};


export const verifyCustomerOTP = (email, otp) => {
  return fetchWithAuth('/api/v1/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
};

export const resendOTP = (email) => {
  return fetchWithAuth('/api/v1/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};
