import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../../components/admin/DataTable';
import { toast } from 'react-toastify';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/api/products'; // Corrected path
import { getCategories } from '../../services/api/categories';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // For Add/Edit form
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null); // For Delete confirmation
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
  });

  // Table columns - Needs update to reflect backend data structure (e.g., category name)
  const columns = React.useMemo(() => [
    {
      Header: 'Product',
      accessor: 'name',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-md object-cover"
              src={row.original.image_url || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product"} // Use image_url
              alt={row.original.name}
              crossOrigin="anonymous" // Added for potential CORS issues with external images
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.original.name}</div>
            {/* Display category name from the nested category object */}
            <div className="text-sm text-gray-500">{row.original.category?.name || 'N/A'}</div>
          </div>
        </div>
      )
    },
    {
      Header: 'Price',
      accessor: 'price',
      Cell: ({ value }) => `$${value ? value.toFixed(2) : '0.00'}` // Handle potential null/undefined price
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
          {value ?? 0} {/* Handle potential null/undefined stock */}
        </span>
      )
    },
    // Removed 'Installment' column as it's not in the backend schema
    // {
    //   Header: 'Installment', ...
    // },
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
  ], []); // Empty dependency array as columns don't depend on component state/props here

  // Fetching logic using useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch products for the current page
      const productData = await getProducts(pagination.page, pagination.size);
      setProducts(productData.items || []); // Ensure items is an array
      setPagination(prev => ({
        ...prev,
        total: productData.total || 0, // Ensure total is a number
      }));

      // Fetch all categories for the dropdown
      const categoryData = await getCategories(1, 100); // Fetch up to 100, adjust if needed
      setCategories(categoryData.items || []); // Ensure items is an array

    } catch (err) {
      console.error("Failed to fetch data:", err);
      const errorMsg = err.message || 'Failed to fetch data';
      setError(errorMsg);
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size]); // Re-fetch when page or size changes

  // useEffect to call fetchData on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle add new product
  const handleAddNew = () => {
    setCurrentProduct({
      // Initialize with backend schema fields
      id: null, // Important for distinguishing add vs edit
      name: '',
      price: '', // Use empty string for controlled number inputs
      stock: '', // Use empty string for controlled number inputs
      category_id: '', // Use category_id
      description: '', // Add description
      image_url: '' // Use image_url
    });
    setIsModalOpen(true);
  };

  // Handle edit product
  const handleEdit = (product) => {
    // Map backend data to form state
    setCurrentProduct({
      ...product,
      price: product.price ?? '', // Handle potential null/undefined
      stock: product.stock ?? '', // Handle potential null/undefined
      category_id: product.category?.id || '', // Get category ID
      image_url: product.image_url || '', // Ensure image_url is used
      description: product.description || '',
    });
    setIsModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirm - Updated to call API
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast.success(`${productToDelete.name} has been deleted`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      // Refresh data, potentially adjusting page if last item on page deleted
      if (products.length === 1 && pagination.page > 1) {
        handlePageChange(pagination.page - 1);
      } else {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error(`Error deleting product: ${err.message}`);
    }
  };

  // Handle form submit - Updated to call API
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    // Prepare data payload matching backend schema (ProductCreate/ProductUpdate)
    const payload = {
      name: currentProduct.name,
      price: parseFloat(currentProduct.price) || 0,
      stock: parseInt(currentProduct.stock, 10) || 0,
      category_id: parseInt(currentProduct.category_id, 10),
      description: currentProduct.description || null, // Send null if empty
      image_url: currentProduct.image_url || null, // Send null if empty
    };

    // Basic Validations
    if (!payload.name) {
        toast.error("Product name is required.");
        return;
    }
     if (isNaN(payload.price) || payload.price < 0) {
        toast.error("Please enter a valid non-negative price.");
        return;
    }
     if (isNaN(payload.stock) || payload.stock < 0) {
        toast.error("Please enter a valid non-negative stock quantity.");
        return;
    }
    if (!payload.category_id || isNaN(payload.category_id)) {
        toast.error("Please select a valid category.");
        return;
    }

    setLoading(true); // Indicate loading state during API call
    try {
      if (currentProduct.id) {
        // Update existing product
        await updateProduct(currentProduct.id, payload);
        toast.success(`${currentProduct.name} has been updated`);
      } else {
        // Add new product
        await createProduct(payload);
        toast.success(`${payload.name} has been added`);
      }
      setIsModalOpen(false);
      setCurrentProduct(null);
      fetchData(); // Refresh the product list
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error(`Error saving product: ${err.message}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle input change - Adjusted for new fields
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      // Keep price/stock as string for controlled input, convert on submit
      [name]: value
    }));
  };

  // Handle pagination change
  const handlePageChange = (newPage) => {
    // Ensure newPage is within valid bounds if possible (though fetchData handles API response)
    if (newPage >= 1) {
        setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleSizeChange = (newSize) => {
    setPagination(prev => ({ ...prev, page: 1, size: newSize })); // Reset to page 1 on size change
  };


  // Render loading state
  if (loading && products.length === 0) { // Show loading only on initial load
    return <div className="text-center py-10">Loading products...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center py-10 text-red-600">Error loading products: {error}</div>;
  }

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
        // Pass loading state if DataTable supports it
        // loading={loading}
      />

      {/* Basic Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
         <span>
           Page {pagination.page} of {Math.ceil(pagination.total / pagination.size) || 1} ({pagination.total} items)
         </span>
         <div>
           <button
             onClick={() => handlePageChange(pagination.page - 1)}
             disabled={pagination.page <= 1 || loading}
             className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Previous
           </button>
           <button
             onClick={() => handlePageChange(pagination.page + 1)}
             disabled={(pagination.page * pagination.size >= pagination.total) || loading}
             className="ml-2 px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Next
           </button>
           {/* Page size selector */}
           <select
             value={pagination.size}
             onChange={(e) => handleSizeChange(Number(e.target.value))}
             disabled={loading}
             className="ml-4 p-1 border rounded disabled:opacity-50"
           >
             <option value={10}>10 per page</option>
             <option value={25}>25 per page</option>
             <option value={50}>50 per page</option>
           </select>
         </div>
       </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto"> {/* Increased z-index */}
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal positioning */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal Panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form id="product-form" onSubmit={handleFormSubmit}> {/* Moved form tag to wrap content and buttons */}
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4"> {/* Added margin-bottom */}
                        {currentProduct?.id ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      <div className="space-y-4"> {/* Added space-y for better spacing */}
                        {/* Product Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={currentProduct?.name || ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        {/* Price & Stock */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price ($)
                            </label>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              min="0"
                              step="0.01"
                              value={currentProduct?.price ?? ''}
                              onChange={handleInputChange}
                              required
                              placeholder="e.g., 19.99"
                              className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                              Stock
                            </label>
                            <input
                              type="number"
                              name="stock"
                              id="stock"
                              min="0"
                              step="1"
                              value={currentProduct?.stock ?? ''}
                              onChange={handleInputChange}
                              required
                              placeholder="e.g., 50"
                              className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        {/* Category Select */}
                        <div>
                          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category_id"
                            name="category_id" // Use category_id
                            value={currentProduct?.category_id || ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Description Field */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description (Optional)
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={currentProduct?.description || ''}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Brief description for the product..."
                          />
                        </div>

                        {/* Image URL Field */}
                        <div>
                          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                            Image URL (Optional)
                          </label>
                          <input
                            type="text" // Consider type="url" for basic validation
                            name="image_url" // Use image_url
                            id="image_url"
                            value={currentProduct?.image_url || ''}
                            onChange={handleInputChange}
                            className="mt-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Modal Footer/Actions */}
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit" // Triggers form onSubmit
                    disabled={loading} // Disable button while submitting
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (currentProduct?.id ? 'Save Changes' : 'Add Product')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading} // Disable cancel while submitting
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form> {/* Close form tag */}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto"> {/* Increased z-index */}
           <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal positioning */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            {/* Modal Panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <i className="bi bi-exclamation-triangle text-red-600 text-xl"></i> {/* Using Bootstrap Icons class */}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={loading} // Disable button while delete might be in progress from main form
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={loading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
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
