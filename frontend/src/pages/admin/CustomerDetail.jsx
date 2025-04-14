import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Mock data for customers
const customers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    totalSpent: 1500,
    activeInstallments: 2,
    joinDate: '2023-01-15',
    status: 'active',
    installments: [
      {
        id: 1,
        productName: 'Samsung Galaxy S21',
        productImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
        totalAmount: 1200,
        paidAmount: 800,
        remainingAmount: 400,
        nextDueDate: '2023-12-15',
        installmentNumber: 3,
        totalInstallments: 4,
        status: 'pending',
        startDate: '2023-09-15',
        paymentHistory: [
          { date: '2023-09-15', amount: 300, status: 'completed' },
          { date: '2023-10-15', amount: 300, status: 'completed' },
          { date: '2023-11-15', amount: 200, status: 'completed' },
        ]
      },
      {
        id: 2,
        productName: 'MacBook Air M1',
        productImage: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        totalAmount: 1800,
        paidAmount: 900,
        remainingAmount: 900,
        nextDueDate: '2023-12-20',
        installmentNumber: 2,
        totalInstallments: 4,
        status: 'pending',
        startDate: '2023-10-20',
        paymentHistory: [
          { date: '2023-10-20', amount: 450, status: 'completed' },
          { date: '2023-11-20', amount: 450, status: 'completed' },
        ]
      }
    ],
    paymentHistory: [
      { id: 1, date: '2023-09-15', amount: 300, product: 'Samsung Galaxy S21', status: 'completed' },
      { id: 2, date: '2023-10-15', amount: 300, product: 'Samsung Galaxy S21', status: 'completed' },
      { id: 3, date: '2023-10-20', amount: 450, product: 'MacBook Air M1', status: 'completed' },
      { id: 4, date: '2023-11-15', amount: 200, product: 'Samsung Galaxy S21', status: 'completed' },
      { id: 5, date: '2023-11-20', amount: 450, product: 'MacBook Air M1', status: 'completed' },
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(234) 567-8901',
    address: '456 Oak St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    totalSpent: 2200,
    activeInstallments: 1,
    joinDate: '2023-02-20',
    status: 'active',
    installments: [
      {
        id: 3,
        productName: 'Sony PlayStation 5',
        productImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        totalAmount: 600,
        paidAmount: 150,
        remainingAmount: 450,
        nextDueDate: '2023-12-05',
        installmentNumber: 1,
        totalInstallments: 4,
        status: 'overdue',
        startDate: '2023-11-05',
        paymentHistory: [
          { date: '2023-11-05', amount: 150, status: 'completed' },
        ]
      }
    ],
    paymentHistory: [
      { id: 6, date: '2023-11-05', amount: 150, product: 'Sony PlayStation 5', status: 'completed' },
    ]
  }
];

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  
  useEffect(() => {
    // Simulate API call to fetch customer details
    const fetchCustomer = () => {
      setLoading(true);
      setTimeout(() => {
        const foundCustomer = customers.find(c => c.id === parseInt(id));
        if (foundCustomer) {
          setCustomer(foundCustomer);
          setEditedCustomer({ ...foundCustomer });
        }
        setLoading(false);
      }, 500);
    };

    fetchCustomer();
  }, [id]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate progress percentage
  const calculateProgress = (paidAmount, totalAmount) => {
    return (paidAmount / totalAmount) * 100;
  };
  
  // Handle edit customer
  const handleEditCustomer = () => {
    setIsEditModalOpen(true);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({
      ...editedCustomer,
      [name]: value
    });
  };
  
  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would make an API call to update the customer
    setCustomer(editedCustomer);
    toast.success('Customer information updated successfully');
    setIsEditModalOpen(false);
  };
  
  // Handle send reminder
  const handleSendReminder = (installmentId) => {
    toast.success('Payment reminder sent successfully');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <i className="bi bi-exclamation-triangle text-yellow-500 text-5xl"></i>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Customer Not Found</h2>
        <p className="mt-2 text-gray-600">The customer you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/admin/customers')}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/admin/customers"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <i className="bi bi-arrow-left mr-1"></i>
          Back to Customers
        </Link>
      </div>
      
      {/* Customer Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-semibold">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  customer.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  Customer since {formatDate(customer.joinDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex">
            <button
              onClick={handleEditCustomer}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <i className="bi bi-pencil mr-2"></i>
              Edit Customer
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'installments'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('installments')}
          >
            Installments
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'payments'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('payments')}
          >
            Payment History
          </button>
        </div>
        
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">${customer.totalSpent.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Active Installments</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{customer.activeInstallments}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Last Payment</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {customer.paymentHistory.length > 0 
                      ? formatDate(customer.paymentHistory[0].date) 
                      : 'No payments yet'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{customer.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{customer.phone}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {customer.paymentHistory.slice(0, 3).map((payment, index) => (
                          <li key={payment.id}>
                            <div className="relative pb-8">
                              {index !== customer.paymentHistory.slice(0, 3).length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
                                    <i className="bi bi-credit-card text-green-600"></i>
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Payment of <span className="font-medium text-gray-900">${payment.amount.toFixed(2)}</span> for {payment.product}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {formatDate(payment.date)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {customer.paymentHistory.length > 3 && (
                      <div className="mt-6 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveTab('payments')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          View All Activity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Installments Tab */}
          {activeTab === 'installments' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Installment Plans</h3>
              
              {customer.installments.length > 0 ? (
                <div className="space-y-6">
                  {customer.installments.map(installment => (
                    <div key={installment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={installment.productImage || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product"} 
                            alt={installment.productName}
                            className="w-16 h-16 object-cover rounded-md"
                            crossOrigin="anonymous"
                          />
                          <div className="ml-4">
                            <h4 className="text-lg font-semibold text-gray-800">{installment.productName}</h4>
                            <div className="flex items-center mt-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                installment.status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : installment.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {installment.status.charAt(0).toUpperCase() + installment.status.slice(1)}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                Installment {installment.installmentNumber} of {installment.totalInstallments}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {installment.status !== 'paid' && (
                            <button
                              onClick={() => handleSendReminder(installment.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <i className="bi bi-bell mr-1"></i>
                              Send Reminder
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Payment Progress</span>
                          <span>{Math.round(calculateProgress(installment.paidAmount, installment.totalAmount))}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary-600 h-2.5 rounded-full" 
                            style={{ width: `${calculateProgress(installment.paidAmount, installment.totalAmount)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-md font-semibold text-gray-800">${installment.totalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Paid Amount</p>
                          <p className="text-md font-semibold text-green-600">${installment.paidAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Remaining</p>
                          <p className="text-md font-semibold text-accent-600">${installment.remainingAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Next Due Date</p>
                          <p className="text-md font-semibold text-gray-800">{formatDate(installment.nextDueDate)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Payment History</h5>
                        <div className="space-y-2">
                          {installment.paymentHistory.map((payment, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">{formatDate(payment.date)}</span>
                              <span className="font-medium text-gray-800">${payment.amount.toFixed(2)}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : payment.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <i className="bi bi-credit-card text-gray-400 text-4xl"></i>
                  <h4 className="mt-2 text-lg font-medium text-gray-900">No Installment Plans</h4>
                  <p className="mt-1 text-sm text-gray-500">This customer doesn't have any installment plans yet.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Payment History Tab */}
          {activeTab === 'payments' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
              
              {customer.paymentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.paymentHistory.map(payment => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.product}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${payment.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : payment.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <i className="bi bi-credit-card text-gray-400 text-4xl"></i>
                  <h4 className="mt-2 text-lg font-medium text-gray-900">No Payment History</h4>
                  <p className="mt-1 text-sm text-gray-500">This customer hasn't made any payments yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Customer Information
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Full Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={editedCustomer?.name || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email Address
                            </label>
                            <div className="mt-1">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={editedCustomer?.email || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              Phone Number
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={editedCustomer?.phone || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <div className="mt-1">
                              <select
                                id="status"
                                name="status"
                                value={editedCustomer?.status || ''}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="sm:col-span-6">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                              Address
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="address"
                                id="address"
                                value={editedCustomer?.address || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-2">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                              City
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="city"
                                id="city"
                                value={editedCustomer?.city || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-2">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                              State
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="state"
                                id="state"
                                value={editedCustomer?.state || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-2">
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                              ZIP Code
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="zipCode"
                                id="zipCode"
                                value={editedCustomer?.zipCode || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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

export default CustomerDetail;
