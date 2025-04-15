import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';

const AdminPurchaseDetail = () => {
  const location = useLocation();
  const { id } = useParams();
  const purchase = location.state?.purchase; // Get purchase data from route state

  if (!purchase) {
    // Handle case where data wasn't passed correctly or user navigated directly
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

  // Helper to format date
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
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
          <div><span className="font-medium text-gray-600">Status:</span> <span className={`font-semibold ${purchase.status === 'paid' ? 'text-green-600' : purchase.status === 'pending' ? 'text-orange-600' : 'text-red-600'}`}>{purchase.status}</span></div>
          <div><span className="font-medium text-gray-600">Created At:</span> {formatDate(purchase.created_at)}</div>
          <div><span className="font-medium text-gray-600">Last Updated:</span> {formatDate(purchase.updated_at)}</div>
        </div>
      </div>

      {/* Installments Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Installments ({purchase.number_of_installments})</h2>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No installments associated with this purchase.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPurchaseDetail;
