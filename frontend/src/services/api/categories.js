import fetchWithAuth from '../api';

// Function to get all categories (adjust size limit if needed)
export const getCategories = (page = 1, size = 100) => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  // Note: Ensure the backend endpoint matches '/api/v1/categories/'
  return fetchWithAuth(`/api/v1/categories/?${params.toString()}`);
};

// Create new category
export const createCategory = (categoryData) => {
  return fetchWithAuth('/api/v1/categories/', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

// Update existing category
export const updateCategory = (categoryId, categoryData) => {
  return fetchWithAuth(`/api/v1/categories/${categoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(categoryData),
  });
};

// Delete category
export const deleteCategory = (categoryId) => {
  return fetchWithAuth(`/api/v1/categories/${categoryId}`, {
    method: 'DELETE',
  });
};
