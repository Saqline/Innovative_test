import fetchWithAuth from '../api'; // Assuming fetchWithAuth remains in api.js

// Function to get a list of products with pagination and optional category filter
export const getProducts = (page = 1, size = 10, categoryId = null) => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (categoryId !== null && categoryId !== undefined) {
    params.append('category_id', String(categoryId));
  }
  // Note: Ensure the backend endpoint matches '/api/v1/products/'
  return fetchWithAuth(`/api/v1/products/?${params.toString()}`);
};

// Function to get a single product by its ID
export const getProductById = (productId) => {
  // Note: Ensure the backend endpoint matches '/api/v1/products/{productId}'
  return fetchWithAuth(`/api/v1/products/${productId}`);
};

// Function to create a new product (Admin only)
export const createProduct = (productData) => {
  // Note: Ensure the backend endpoint matches '/api/v1/products/'
  return fetchWithAuth('/api/v1/products/', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

// Function to update an existing product (Admin only)
export const updateProduct = (productId, productData) => {
  // Note: Ensure the backend endpoint matches '/api/v1/products/{productId}'
  // Using PATCH as per the backend router
  return fetchWithAuth(`/api/v1/products/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(productData),
  });
};

// Function to delete a product (Admin only)
export const deleteProduct = (productId) => {
  // Note: Ensure the backend endpoint matches '/api/v1/products/{productId}'
  return fetchWithAuth(`/api/v1/products/${productId}`, {
    method: 'DELETE',
  });
};
