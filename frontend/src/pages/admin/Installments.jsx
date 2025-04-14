import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import { toast } from 'react-toastify';

// Mock data for installments
const initialInstallments = [
  {
    id: 1,
    customer: 'John Doe',
    customerId: 1,
    product: 'Samsung Galaxy S21',
    productImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
    totalAmount: 1200,
    paidAmount: 800,
    remainingAmount: 400,
    nextDueDate: '2023-12-15',
    installmentNumber: 3,
    totalInstallments: 4,
    status: 'pending',
    startDate: '2023-09-15'
  },
  {
    id: 2,
    customer: 'John Doe',
    customerId: 1,
    product: 'MacBook Air M1',
    productImage: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    totalAmount: 1800,
    paidAmount: 900,
    remainingAmount: 900,
    nextDueDate: '2023-12-20',
    installmentNumber: 2,
    totalInstallments: 4,
    status: 'pending',
    startDate: '2023-10-20'
  },
  {
    id: 3,
    customer: 'Jane Smith',
    customerId: 2,
    product: 'Sony PlayStation 5',
    productImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    totalAmount: 600,
    paidAmount: 150,
    remainingAmount: 450,
    nextDueDate: '2023-12-05',
    installmentNumber: 1,
    totalInstallments: 4,
    status: 'overdue',
    startDate: '2023-11-05'
  },
  {
    id: 4,
    customer: 'Emily Davis',
    customerId: 4,
    product: 'Apple iPad Pro',
    productImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
    totalAmount: 1000,
    paidAmount: 1000,
    remainingAmount: 0,
    nextDueDate: null,
    installmentNumber: 4,
    totalInstallments: 4,
    status: 'paid',
    startDate: '2023-08-10'
  },
  {
    id: 5,
    customer: 'Michael Wilson',
    customerId: 5,
    product: 'Dell XPS 13',
    productImage: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
    totalAmount: 1500,
    paidAmount: 375,
    remainingAmount: 1125,
    nextDueDate: '2023-11-25',
    installmentNumber: 1,
    totalInstallments: 4,
    status: 'overdue',
    startDate: '2023-10-25'
  },
  {
    id: 6,
    customer: 'Sarah Thompson',
    customerId: 6,
    product: 'iPhone 13 Pro',
    productImage: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80',
    totalAmount: 1100,
    paidAmount: 275,
    remainingAmount: 825,
    nextDueDate: '2023-12-10',
    installmentNumber: 1,
    totalInstallments: 4,
    status: 'pending',
    startDate: '2023-11-10'
  },
  {
    id: 7,
    customer: 'David Miller',
    customerId: 7,
    product: 'LG OLED TV',
    productImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    totalAmount: 2200,
    paidAmount: 550,
    remainingAmount: 1650,
    nextDueDate: '2023-12-12',
    installmentNumber: 1,
    totalInstallments: 4,
    status: 'pending',
    startDate: '2023-11-12'
  }
];

const Installments = () => {
  const [installments, setInstallments] = useState(initialInstallments);
  const [activeTab, setActiveTab] = useState('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [installmentToRemind, setInstallmentToRemind] = useState(null);
  
  // Filter installments based on active tab
  const filteredInstallments = installments.filter(installment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return installment.status === 'pending';
    if (activeTab === 'overdue') return installment.status === 'overdue';
    if (activeTab === 'paid') return installment.status === 'paid';
    return true;
  });
  
  // Table columns
  const columns = [
    {
      Header: 'Customer',
      accessor: 'customer',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {row.original.customer.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.original.customer}</div>
          </div>
        </div>
      )
    },
    {
      Header: 'Product',
      accessor: 'product',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              className="h-10 w-10 rounded-md object-cover" 
              src={row.original.productImage || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product"} 
              alt={row.original.product}
              crossOrigin="anonymous"
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.original.product}</div>
          </div>
        </div>
      )
    },
    {
      Header: 'Progress',
      accessor: 'paidAmount',
      Cell: ({ row }) => {
        const progressPercentage = (row.original.paidAmount / row.original.totalAmount) * 100;
        return (
          <div>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ${row.original.paidAmount.toFixed(2)} of ${row.original.totalAmount.toFixed(2)}
            </div>
          </div>
        );
      }
    },
    {
      Header: 'Next Due',
      accessor: 'nextDueDate',
      Cell: ({ value, row }) => {
        if (!value) return <span className="text-sm text-gray-500">-</span>;
        
        const dueDate = new Date(value);
        const today = new Date();
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <div>
            <div className="text-sm text-gray-900">{new Date(value).toLocaleDateString()}</div>
            <div className={`text-xs ${
              diffDays < 0 
                ? 'text-red-600' 
                : diffDays <= 3 
                ? 'text-yellow-600' 
                : 'text-gray-500'
            }`}>
              {diffDays < 0 
                ? `Overdue by ${Math.abs(diffDays)} days` 
                : diffDays === 0 
                ? 'Due today' 
                : `Due in ${diffDays} days`}
            </div>
          </div>
        );
      }
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'paid' 
            ? 'bg-green-100 text-green-800' 
            : value === 'pending' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.original.status !== 'paid' && (
            <>
              <button
                onClick={() => handlePaymentClick(row.original)}
                className="text-primary-600 hover:text-primary-900"
              >
                Record Payment
              </button>
              <button
                onClick={() => handleReminderClick(row.original)}
                className="text-yellow-600 hover:text-yellow-900"
              >
                Send Reminder
              </button>
            </>
          )}
          <button
            onClick={() => handleViewDetails(row.original.customerId)}
            className="text-gray-600 hover:text-gray-900"
          >
            View Details
          </button>
        </div>
      )
    }
  ];
  
  // Handle payment click
  const handlePaymentClick = (installment) => {
    setSelectedInstallment(installment);
    setPaymentAmount(installment.remainingAmount.toFixed(2));
    setIsPaymentModalOpen(true);
  };
  
  // Handle reminder click
  const handleReminderClick = (installment) => {
    setInstallmentToRemind(installment);
    setIsReminderModalOpen(true);
  };
  
  // Handle view details
  const handleViewDetails = (customerId) => {
    // In a real app, this would navigate to the customer details page
    window.location.href = `/admin/customers/${customerId}`;
  };
  
  // Handle payment submit
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedInstallment) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedInstallment.remainingAmount) {
      toast.error('Please enter a valid payment amount');
      return;
    }
    
    // Update the installment
    const updatedInstallments = installments.map(inst => {
      if (inst.id === selectedInstallment.id) {
        const paidAmount = inst.paidAmount + amount;
        const remainingAmount = inst.totalAmount - paidAmount;
        const status = remainingAmount <= 0 ? 'paid' : inst.status;
        const nextDueDate = remainingAmount <= 0 ? null : inst.nextDueDate;
        const installmentNumber = remainingAmount <= 0 ? inst.totalInstallments : inst.installmentNumber;
        
        return {
          ...inst,
          paidAmount,
          remainingAmount,
          status,
          nextDueDate,
          installmentNumber
        };
      }
      return inst;
    });
    
    setInstallments(updatedInstallments);
    toast.success(`Payment of $${amount.toFixed(2)} recorded successfully`);
    setIsPaymentModalOpen(false);
    setSelectedInstallment(null);
    setPaymentAmount('');
  };
  
  // Handle reminder submit
  const handleReminderSubmit = (e) => {
    e.preventDefault();
    
    if (!installmentToRemind) return;
    
    toast.success(`Payment reminder sent to ${installmentToRemind.customer}`);
    setIsReminderModalOpen(false);
    setInstallmentToRemind(null);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Installment Management</h1>
        <p className="text-gray-600">Track and manage customer installment plans</p>
      </div>
      
      {/* Installment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <i className="bi bi-credit-card text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Installments</p>
              <p className="text-2xl font-semibold text-gray-800">{installments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="bi bi-hourglass-split text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Installments</p>
              <p className="text-2xl font-semibold text-gray-800">
                {installments.filter(i => i.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <i className="bi bi-exclamation-triangle text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overdue Installments</p>
              <p className="text-2xl font-semibold text-gray-800">
                {installments.filter(i => i.status === 'overdue').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="bi bi-check-circle text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Installments</p>
              <p className="text-2xl font-semibold text-gray-800">
                {installments.filter(i => i.status === 'paid').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Installment Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'all'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Installments
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'pending'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'overdue'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overdue')}
          >
            Overdue
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'paid'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('paid')}
          >
            Completed
          </button>
        </div>
      </div>
      
      {/* Installments Table */}
      <DataTable 
        columns={columns} 
        data={filteredInstallments} 
        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Installments`} 
        filterPlaceholder="Search installments..." 
      />
      
      {/* Payment Modal */}
      {isPaymentModalOpen && selectedInstallment && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i className="bi bi-credit-card text-primary-600"></i>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Record Payment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Recording payment for {selectedInstallment.customer}'s {selectedInstallment.product} installment.
                      </p>
                      
                      <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">Total Amount:</span>
                          <span className="text-sm font-medium text-gray-900">${selectedInstallment.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">Paid Amount:</span>
                          <span className="text-sm font-medium text-green-600">${selectedInstallment.paidAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Remaining Amount:</span>
                          <span className="text-sm font-medium text-accent-600">${selectedInstallment.remainingAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <form onSubmit={handlePaymentSubmit} className="mt-4">
                        <div>
                          <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                            Payment Amount
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="paymentAmount"
                              id="paymentAmount"
                              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                              step="0.01"
                              min="0.01"
                              max={selectedInstallment.remainingAmount}
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">USD</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
                            Payment Date
                          </label>
                          <input
                            type="date"
                            name="paymentDate"
                            id="paymentDate"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                            Payment Method
                          </label>
                          <select
                            id="paymentMethod"
                            name="paymentMethod"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            defaultValue="credit-card"
                          >
                            <option value="credit-card">Credit Card</option>
                            <option value="debit-card">Debit Card</option>
                            <option value="bank-transfer">Bank Transfer</option>
                            <option value="cash">Cash</option>
                          </select>
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes (Optional)
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows="3"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Add any additional notes about this payment"
                          ></textarea>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handlePaymentSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Record Payment
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reminder Modal */}
      {isReminderModalOpen && installmentToRemind && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i className="bi bi-bell text-yellow-600"></i>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Send Payment Reminder
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Send a payment reminder to {installmentToRemind.customer} for their {installmentToRemind.product} installment.
                      </p>
                      
                      <div className="mt-4 bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">Customer:</span>
                          <span className="text-sm font-medium text-gray-900">{installmentToRemind.customer}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">Product:</span>
                          <span className="text-sm font-medium text-gray-900">{installmentToRemind.product}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">Due Amount:</span>
                          <span className="text-sm font-medium text-accent-600">${installmentToRemind.remainingAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-500">Due Date:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(installmentToRemind.nextDueDate)}</span>
                        </div>
                      </div>
                      
                      <form onSubmit={handleReminderSubmit} className="mt-4">
                        <div>
                          <label htmlFor="reminderType" className="block text-sm font-medium text-gray-700">
                            Reminder Type
                          </label>
                          <select
                            id="reminderType"
                            name="reminderType"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            defaultValue="email"
                          >
                            <option value="email">Email</option>
                            <option value="sms">SMS</option>
                            <option value="both">Both Email & SMS</option>
                          </select>
                        </div>
                        
                        <div className="mt-4">
                          <label htmlFor="reminderMessage" className="block text-sm font-medium text-gray-700">
                            Custom Message (Optional)
                          </label>
                          <textarea
                            id="reminderMessage"
                            name="reminderMessage"
                            rows="3"
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Add a custom message to the reminder"
                            defaultValue={`Dear ${installmentToRemind.customer},\n\nThis is a friendly reminder that your installment payment of $${installmentToRemind.remainingAmount.toFixed(2)} for ${installmentToRemind.product} is due on ${formatDate(installmentToRemind.nextDueDate)}.\n\nThank you.`}
                          ></textarea>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleReminderSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Send Reminder
                </button>
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Installments;
