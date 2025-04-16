import React from 'react';
import Cart from '../../components/customer/Cart';

const CartPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
      </div>
      <Cart />
    </div>
  );
};

export default CartPage;