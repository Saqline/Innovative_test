import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we have the required data
  useEffect(() => {
    if (!location.state || !location.state.product) {
      navigate('/customer');
    }
  }, [location, navigate]);
  
  // If no state, show loading
  if (!location.state || !location.state.product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  const { 
    product, 
    quantity, 
    total, 
    firstPaymentAmount, 
  } = location.state;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Generate transaction ID
  const transactionId = `TRX-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-green-50 border-b border-gray-200 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
            <i className="bi bi-check-lg text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">
            Your payment has been processed successfully.
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="text-md font-medium text-gray-800">{transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-md font-medium text-gray-800">{formatDate(new Date().toISOString())}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-md font-medium text-gray-800">Credit Card (•••• 4242)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="text-md font-medium text-green-600">${firstPaymentAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          
          
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
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
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              A confirmation email has been sent to your email address.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/customer/installments"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View My Installments
              </Link>
              <Link
                to="/customer"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
