import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { payInstallment } from '../../services/api';

const AdminPurchaseDetail = () => {
  const location = useLocation();
  const { id } = useParams();
  const [purchase, setPurchase] = useState(location.state?.purchase);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  if (!purchase) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Purchase Details</h1>
        <p className="text-red-600">Could not load purchase data. Please navigate from the purchases list.</p>
        <Link to="/admin/purchases" className="text-primary-600 hover:underline mt-4 inline-block">
          &larr; Back to Purchases
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
  };

  const handlePaymentClick = (installment) => {
    setSelectedInstallment(installment);
    setIsConfirmModalOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedInstallment) return;

    setProcessingPayment(true);
    try {
      const response = await payInstallment(selectedInstallment.id);
      
      // Update local state to reflect the payment
      setPurchase(prevPurchase => {
        const updatedInstallments = prevPurchase.purchase_installments.map(inst => {
          if (inst.id === selectedInstallment.id) {
            return {
              ...inst,
              is_paid: true,
              status: 'paid',
              paid_date: new Date().toISOString()
            };
          }
          return inst;
        });

        // Calculate new paid and due amounts
        const paidAmount = updatedInstallments.reduce((sum, inst) => 
          inst.is_paid ? sum + inst.amount : sum, 0
        );

        return {
          ...prevPurchase,
          purchase_installments: updatedInstallments,
          paid_amount: paidAmount,
          due_amount: prevPurchase.total_amount - paidAmount,
          status: paidAmount >= prevPurchase.total_amount ? 'paid' : 'pending'
        };
      });

      toast.success('Payment processed successfully');
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessingPayment(false);
      setIsConfirmModalOpen(false);
      setSelectedInstallment(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin/purchases" className="text-primary-600 hover:underline mb-2 inline-block">
          &larr; Back to Purchases
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Purchase Details #{purchase.id}</h1>
      </div>

      {/* Purchase Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium text-gray-600">Purchase ID:</span> {purchase.id}</div>
          <div><span className="font-medium text-gray-600">User ID:</span> {purchase.user_id}</div>
          <div><span className="font-medium text-gray-600">Product ID:</span> {purchase.product_id}</div>
          <div><span className="font-medium text-gray-600">Quantity:</span> {purchase.quantity}</div>
          <div><span className="font-medium text-gray-600">Total Amount:</span> ${purchase.total_amount?.toFixed(2)}</div>
          <div><span className="font-medium text-gray-600">Paid Amount:</span> ${purchase.paid_amount?.toFixed(2)}</div>
          <div><span className="font-medium text-gray-600">Due Amount:</span> ${purchase.due_amount?.toFixed(2)}</div>
          <div>
            <span className="font-medium text-gray-600">Status:</span> 
            <span className={`ml-2 font-semibold ${
              purchase.status === 'paid' ? 'text-green-600' : 
              purchase.status === 'pending' ? 'text-orange-600' : 
              'text-red-600'
            }`}>
              {purchase.status}
            </span>
          </div>
          <div><span className="font-medium text-gray-600">Created At:</span> {formatDate(purchase.created_at)}</div>
          <div><span className="font-medium text-gray-600">Last Updated:</span> {formatDate(purchase.updated_at)}</div>
        </div>
      </div>

      {/* Installments Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Installments ({purchase.number_of_installments})
        </h2>
        {purchase.purchase_installments && purchase.purchase_installments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchase.purchase_installments.map((inst) => (
                  <tr key={inst.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{inst.installment_no}</td>
                    <td className="px-4 py-2 whitespace-nowrap">${inst.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(inst.due_date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`font-medium ${inst.is_paid ? 'text-green-600' : 'text-orange-600'}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(inst.paid_date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {!inst.is_paid && (
                        <button
                          onClick={() => handlePaymentClick(inst)}
                          disabled={processingPayment}
                          className={`
                            px-3 py-1 rounded-md text-sm font-medium
                            ${processingPayment 
                              ? 'bg-gray-300 cursor-not-allowed' 
                              : 'bg-green-600 text-white hover:bg-green-700'}
                          `}
                        >
                          {processingPayment ? 'Processing...' : 'Pay'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No installments associated with this purchase.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && selectedInstallment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Payment
            </h3>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to process the payment for:
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><span className="font-medium">Installment:</span> #{selectedInstallment.installment_no}</p>
                <p><span className="font-medium">Amount:</span> ${selectedInstallment.amount.toFixed(2)}</p>
                <p><span className="font-medium">Due Date:</span> {formatDate(selectedInstallment.due_date)}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setSelectedInstallment(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={processingPayment}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={processingPayment}
                className={`px-4 py-2 rounded-md text-white ${
                  processingPayment
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {processingPayment ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPurchaseDetail;
