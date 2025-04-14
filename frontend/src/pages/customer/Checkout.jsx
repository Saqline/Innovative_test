import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createPurchase } from '../../services/api'; // Import API functions

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with default values
    setProduct(location.state?.product || null);
    setQuantity(location.state?.quantity || 1);
    setLoading(false);
  }, [location.state]);

  // Ensure product and quantity are not null
  if (!product || !quantity) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-yellow-500 text-5xl"></i>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Checkout Information Missing</h2>
          <p className="mt-2 text-gray-600">Please provide the required checkout information.</p>
        </div>
      </div>
    );
  }

  // Calculate amounts
  const calculateAmounts = () => {
    const subtotal = product.price * quantity;
    const total = subtotal;

    return {
      subtotal,
      total,
    };
  };

  const { subtotal, total } = calculateAmounts();

  // Validation schema
  const validationSchema = Yup.object({
    paidAmount: Yup.number().required('Paid amount is required').positive('Paid amount must be positive')
  });

const handlePurchase = async (values) => {
  try {
    const purchaseData = {
      product_id: product.id,
      quantity: quantity,
      paid_amount: values.paidAmount // Use the paid amount from the form input
    };

    const response = await createPurchase(purchaseData);

if (response) {
      toast.success('Payment processed successfully!');
      navigate('/customer/payment-success', {
        state: {
          product,
          quantity,
          total: total,
          firstPaymentAmount: values.paidAmount, // Use the paid amount from the form input
        }
      });
    } else {
      toast.error('Payment failed. Please try again.');
    }
  } catch (error) {
    toast.error(error.message || 'Payment failed. Please try again.');
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <p className="text-gray-600">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md"
                  crossOrigin="anonymous"
                />
                <div className="ml-4">
                  <h3 className="text-md font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {quantity}</p>
                  <p className="text-sm text-gray-500">Price: ${product.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-semibold text-gray-800">Total</span>
                  <span className="text-base font-semibold text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Payment Information</h2>
            </div>
            <div className="p-6">
              <Formik
                initialValues={{
                  paidAmount: total // Add paidAmount to initial values
                }}
                validationSchema={validationSchema}
                onSubmit={handlePurchase}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div>
                      <h3 className="text-md font-semibold text-gray-800 mb-4">Payment Details</h3>
                      <div>
                        <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700">
                          Paid Amount
                        </label>
                        <Field
                          type="number"
                          name="paidAmount"
                          id="paidAmount"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage name="paidAmount" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                            Processing...
                          </span>
                        ) : (
                          `Pay $${values.paidAmount.toFixed(2)} Now`
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
