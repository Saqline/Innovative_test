import fetchWithAuth from '../api';

// Get cart items
export const getCart = () => {
  return fetchWithAuth('/api/v1/cart/');
};

// Add item to cart
export const addToCart = (productId, quantity) => {
  return fetchWithAuth('/api/v1/cart/items', {
    method: 'POST',
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity
    }),
  });
};

// Update cart item quantity
export const updateCartItem = (itemId, quantity) => {
  return fetchWithAuth(`/api/v1/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      quantity: quantity
    }),
  });
};

// Remove item from cart
export const removeCartItem = (itemId) => {
  return fetchWithAuth(`/api/v1/cart/items/${itemId}`, {
    method: 'DELETE',
  });
};

// Clear entire cart
export const clearCart = () => {
  return fetchWithAuth('/api/v1/cart/', {
    method: 'DELETE',
  });
};