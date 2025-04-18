import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { createPurchase } from '../../services/api/purchases';
import { getCustomers as getUsers } from '../../services/api/users';
import { getProducts } from '../../services/api/products';

const CreatePurchaseModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    product_id: '',
    quantity: 1,
    installment_plan: [{ amount: '', days_after: 0 }]
  });
  
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProduct && formData.quantity) {
      const total = selectedProduct.price * formData.quantity;
      setTotalAmount(total);
    }
  }, [selectedProduct, formData.quantity]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      // Handle both array response and paginated response
      setUsers(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users: ' + (error.message || 'Unknown error'));
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      // Handle both array response and paginated response
      setProducts(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products: ' + (error.message || 'Unknown error'));
    }
  };

  const handleProductChange = (e) => {
    const product = products.find(p => p.id === parseInt(e.target.value));
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      product_id: e.target.value
    }));
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      quantity
    }));
  };

  const addInstallment = () => {
    setFormData(prev => ({
      ...prev,
      installment_plan: [...prev.installment_plan, { amount: '', days_after: 0 }]
    }));
  };

  const removeInstallment = (index) => {
    setFormData(prev => ({
      ...prev,
      installment_plan: prev.installment_plan.filter((_, i) => i !== index)
    }));
  };

  const handleInstallmentChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      installment_plan: prev.installment_plan.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateForm = () => {
    if (!formData.user_id || !formData.product_id || formData.quantity < 1) {
      toast.error('Please fill in all required fields');
      return false;
    }

    const totalInstallments = formData.installment_plan.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0), 
      0
    );

    if (Math.abs(totalInstallments - totalAmount) > 0.01) {
      toast.error('Total installments must equal the total amount');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await createPurchase(formData);
      toast.success('Purchase created successfully');
      onSuccess(response);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create purchase');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        {(users.length === 0 || products.length === 0) ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* User Selection */}
              <div>
                <label className="block mb-2">User</label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.user_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                  required
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.email} (ID: {user.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block mb-2">Product</label>
                <select
                  className="w-full border rounded p-2"
                  value={formData.product_id}
                  onChange={handleProductChange}
                  required
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (${product.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border rounded p-2"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  required
                />
              </div>

              {/* Total Amount Display */}
              <div>
                <label className="block mb-2">Total Amount</label>
                <div className="w-full border rounded p-2 bg-gray-100">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Installment Plan */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Installment Plan</h3>
                <button
                  type="button"
                  onClick={addInstallment}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Add Installment
                </button>
              </div>

              {formData.installment_plan.map((installment, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <div className="flex-1">
                    <label className="block mb-1">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border rounded p-2"
                      value={installment.amount}
                      onChange={(e) => handleInstallmentChange(index, 'amount', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1">Days After</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full border rounded p-2"
                      value={installment.days_after}
                      onChange={(e) => handleInstallmentChange(index, 'days_after', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeInstallment(index)}
                      className="self-end mb-2 text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Create Purchase
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePurchaseModal;
