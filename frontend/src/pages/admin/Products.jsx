import React, { useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import { toast } from 'react-toastify';

// Mock data for products
const initialProducts = [
  {
    id: 1,
    name: 'Samsung Galaxy S21',
    price: 1200,
    category: 'Smartphones',
    stock: 15,
    installmentAvailable: true,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
  },
  {
    id: 2,
    name: 'MacBook Air M1',
    price: 1800,
    category: 'Laptops',
    stock: 8,
    installmentAvailable: true,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 3,
    name: 'Sony PlayStation 5',
    price: 600,
    category: 'Gaming',
    stock: 5,
    installmentAvailable: true,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 4,
    name: 'Apple iPad Pro',
    price: 1000,
    category: 'Tablets',
    stock: 12,
    installmentAvailable: true,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
  },
  {
    id: 5,
    name: 'Dell XPS 13',
    price: 1500,
    category: 'Laptops',
    stock: 10,
    installmentAvailable: true,
    image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80'
  },
  {
    id: 6,
    name: 'Canon EOS R5',
    price: 3500,
    category: 'Cameras',
    stock: 3,
    installmentAvailable: true,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1638&q=80'
  },
  {
    id: 7,
    name: 'Bose QuietComfort 45',
    price: 350,
    category: 'Audio',
    stock: 20,
    installmentAvailable: false,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1465&q=80'
  },
  {
    id: 8,
    name: 'LG OLED C1 65"',
    price: 2200,
    category: 'TVs',
    stock: 7,
    installmentAvailable: true,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  }
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Table columns
  const columns = [
    {
      Header: 'Product',
      accessor: 'name',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              className="h-10 w-10 rounded-md object-cover" 
              src={row.original.image || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product"} 
              alt={row.original.name}
              crossOrigin="anonymous"
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.category}</div>
          </div>
        </div>
      )
    },
    {
      Header: 'Price',
      accessor: 'price',
      Cell: ({ value }) => `$${value.toFixed(2)}`
    },
    {
      Header: 'Stock',
      accessor: 'stock',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value > 10 
            ? 'bg-green-100 text-green-800' 
            : value > 0 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      Header: 'Installment',
      accessor: 'installmentAvailable',
      Cell: ({ value }) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Available' : 'Not Available'}
        </span>
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-primary-600 hover:text-primary-900"
          >
            Edit
          </button>
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
  
  // Handle add new product
  const handleAddNew = () => {
    setCurrentProduct({
      id: null,
      name: '',
      price: 0,
      category: '',
      stock: 0,
      installmentAvailable: false,
      image: ''
    });
    setIsModalOpen(true);
  };
  
  // Handle edit product
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };
  
  // Handle delete click
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast.success(`${productToDelete.name} has been deleted`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };
  
  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (currentProduct.id) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === currentProduct.id ? currentProduct : p
      ));
      toast.success(`${currentProduct.name} has been updated`);
    } else {
      // Add new product
      const newProduct = {
        ...currentProduct,
        id: Math.max(...products.map(p => p.id)) + 1
      };
      setProducts([...products, newProduct]);
      toast.success(`${newProduct.name} has been added`);
    }
    
    setIsModalOpen(false);
    setCurrentProduct(null);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Add New Product
        </button>
      </div>
      
      {/* Products Table */}
      <DataTable 
        columns={columns} 
        data={products} 
        title="Product Inventory" 
        filterPlaceholder="Search products..." 
      />
      
      {/* Add/Edit Product Modal */}
      {isModalOpen && (
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
                      {currentProduct?.id ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Product Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={currentProduct?.name || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                name="price"
                                id="price"
                                min="0"
                                step="0.01"
                                value={currentProduct?.price || 0}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                              Stock
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                name="stock"
                                id="stock"
                                min="0"
                                value={currentProduct?.stock || 0}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-6">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Category
                            </label>
                            <div className="mt-1">
                              <select
                                id="category"
                                name="category"
                                value={currentProduct?.category || ''}
                                onChange={handleInputChange}
                                required
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="">Select a category</option>
                                <option value="Smartphones">Smartphones</option>
                                <option value="Laptops">Laptops</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Tablets">Tablets</option>
                                <option value="Cameras">Cameras</option>
                                <option value="Audio">Audio</option>
                                <option value="TVs">TVs</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="sm:col-span-6">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                              Image URL
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="image"
                                id="image"
                                value={currentProduct?.image || ''}
                                onChange={handleInputChange}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-6">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="installmentAvailable"
                                  name="installmentAvailable"
                                  type="checkbox"
                                  checked={currentProduct?.installmentAvailable || false}
                                  onChange={handleInputChange}
                                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="installmentAvailable" className="font-medium text-gray-700">
                                  Installment Available
                                </label>
                                <p className="text-gray-500">Allow customers to purchase this product with installment plans.</p>
                              </div>
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
                  {currentProduct?.id ? 'Save Changes' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {productToDelete?.name}? This action cannot be undone.
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

export default Products;
