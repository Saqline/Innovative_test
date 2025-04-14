import React from 'react';

const InstallmentCard = ({ installment }) => {
  const { 
    id, 
    productName, 
    productImage, 
    totalAmount, 
    paidAmount, 
    remainingAmount, 
    nextDueDate, 
    installmentNumber, 
    totalInstallments,
    status
  } = installment;

  // Calculate progress percentage
  const progressPercentage = (paidAmount / totalAmount) * 100;

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <img 
            src={productImage || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product"} 
            alt={productName}
            className="w-16 h-16 object-cover rounded-md"
            crossOrigin="anonymous"
          />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800">{productName}</h3>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                Installment {installmentNumber} of {totalInstallments}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Payment Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold text-gray-800">${totalAmount?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Paid Amount</p>
            <p className="text-lg font-semibold text-green-600">${paidAmount?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-lg font-semibold text-accent-600">${remainingAmount?.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Next Due Date</p>
            <p className="text-lg font-semibold text-gray-800">{formatDate(nextDueDate)}</p>
          </div>
        </div>

        {status !== 'paid' && (
          <div className="mt-4">
            <button className="w-full bg-primary-600 text-white py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-300">
              Pay Next Installment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallmentCard;
