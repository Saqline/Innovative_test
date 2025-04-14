import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Mock data for customers
const initialCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    totalSpent: 1500,
    activeInstallments: 2,
    joinDate: '2023-01-15',
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(234) 567-8901',
    totalSpent: 2200,
    activeInstallments: 1,
    joinDate: '2023-02-20',
    status: 'active'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '(345) 678-9012',
    totalSpent: 800,
    activeInstallments: 1,
    joinDate: '2023-03-10',
    status: 'active'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(456) 789-0123',
    totalSpent: 3500,
    activeInstallments: 0,
    joinDate: '2023-01-05',
    status: 'inactive'
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    phone: '(567) 890-1234',
    totalSpent: 1200,
    activeInstallments: 1,
    joinDate: '2023-04-15',
    status: 'active'
  },
  {
    id: 6,
    name: 'Sarah Thompson',
    email: 'sarah.thompson@example.com',
    phone: '(678) 901-2345',
    totalSpent: 950,
    activeInstallments: 1,
    joinDate: '2023-05-22',
    status: 'active'
  },
  {
    id: 7,
    name: 'David Miller',
    email: 'david.miller@example.com',
    phone: '(789) 012-3456',
    totalSpent: 2800,
    activeInstallments: 1,
    joinDate: '2023-02-28',
    status: 'active'
  },
  {
    id: 8,
    name: 'Jessica Brown',
    email: 'jessica.brown@example.com',
    phone: '(890) 123-4567',
    totalSpent: 1750,
    activeInstallments: 0,
    joinDate: '2023-03-15',
    status: 'inactive'
  }
];

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  // Table columns
  const columns = [
    {
      Header: 'Customer',
      accessor: 'name',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {row.original.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      )
    },
    {
      Header: 'Phone',
      accessor: 'phone',
    },
    {
      Header: 'Total Spent',
      accessor: 'totalSpent',
      Cell: ({ value }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Active Installments',
      accessor: 'activeInstallments',
    },
    {
      Header: 'Join Date',
      accessor: 'joinDate',
      Cell: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link
            to={`/admin/customers/${row.original.id}`}
            className="text-primary-600 hover:text-primary-900"
          >
            View
          </Link>
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      )
    }
  ];
  
  // Handle delete click
  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      toast.success(`${customerToDelete.name} has been deleted`);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-600">Manage your customer accounts and view their installment history</p>
      </div>
      
      {/* Customer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <i className="bi bi-people text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-800">{customers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="bi bi-person-check text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-semibold text-gray-800">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
              <i className="bi bi-credit-card text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Installments</p>
              <p className="text-2xl font-semibold text-gray-800">
                {customers.reduce((sum, customer) => sum + customer.activeInstallments, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-100 text-accent-600">
              <i className="bi bi-currency-dollar text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-800">
                ${customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customers Table */}
      <DataTable 
        columns={columns} 
        data={customers} 
        title="Customer List" 
        filterPlaceholder="Search customers..." 
      />
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i className="bi bi-exclamation-triangle text-red-600"></i>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Customer
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {customerToDelete?.name}? All of their data will be permanently removed. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
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

export default Customers;
