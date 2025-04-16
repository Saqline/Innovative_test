import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../services/api/cart';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total_items: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Add event dispatch for cart updates
  const dispatchCartUpdate = () => {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  const fetchCart = async () => {
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      toast.error('Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      await updateCartItem(itemId, newQuantity);
      await fetchCart(); // Refresh cart
      dispatchCartUpdate(); // Dispatch event after successful update
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await fetchCart(); // Refresh cart
      dispatchCartUpdate(); // Dispatch event after successful removal
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCart({ items: [], total_items: 0, total_amount: 0 });
      dispatchCartUpdate(); // Dispatch event after clearing cart
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = (item) => {
    navigate(`/customer/checkout/${item.product.id}`, {
      state: {
        product: item.product,
        quantity: item.quantity
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          {cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear Cart
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <i className="bi bi-arrow-repeat text-2xl text-primary-600 animate-spin"></i>
          </div>
        ) : cart.items.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3 pb-4 border-b">
                <img
                  src={item.product.image_url || '/placeholder.png'}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">${item.product.price}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="text-sm border rounded px-1 py-0.5"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <div className="flex justify-between text-sm">
                <span>Total Items:</span>
                <span>{cart.total_items}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total Amount:</span>
                <span>${cart.total_amount.toFixed(2)}</span>
              </div>
              <button
                onClick={() => navigate('/customer/checkout')}
                className="w-full mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 text-sm font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
