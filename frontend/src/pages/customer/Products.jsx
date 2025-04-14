import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../../components/customer/ProductCard';
import { getProducts } from '../../services/api'; // Import API function
import { toast } from 'react-toastify';

// Mock Categories (replace with API call if available)
const categories = [
  'All',
  'Smartphones',
  'Laptops',
  'Gaming',
  'Tablets',
  'Cameras',
  'Audio',
  'TVs'
];

const PRODUCTS_PER_PAGE = 6; // Define how many products per page

const Products = () => {
  const [products, setProducts] = useState([]); // Holds the raw data from API for the current page
  const [filteredProducts, setFilteredProducts] = useState([]); // Holds products after frontend filtering/sorting
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]); // Adjust max price if needed
  const [installmentOnly, setInstallmentOnly] = useState(false); // Backend doesn't support this filter yet
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products from API
  const fetchProducts = useCallback(async (page) => {
    setLoading(true);
    setError(null);
    try {
      // Note: Backend category filtering isn't implemented yet based on API spec
      // We'll fetch all for now and filter client-side
      const data = await getProducts(page, PRODUCTS_PER_PAGE);
      setProducts(data.items || []);
      setTotalProducts(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / PRODUCTS_PER_PAGE));
    } catch (err) {
      setError(err.message || 'Failed to fetch products.');
      toast.error(err.message || 'Failed to fetch products.');
      setProducts([]); // Clear products on error
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, fetchProducts itself doesn't change

  // Initial fetch and fetch on page change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, fetchProducts]);

  // Filter and sort products whenever raw products or filters change
  useEffect(() => {
    let result = [...products]; // Start with the raw data for the current page
    
    // Filter by category (Client-side for now)
    if (selectedCategory !== 'All') {
      // Assuming product object has a category object with a name property
      result = result.filter(product => product.category?.name === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by installment availability (Client-side, assuming backend adds this field)
    // if (installmentOnly) {
    //   result = result.filter(product => product.installmentAvailable);
    // }
    
    // Sort products
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm, priceRange, installmentOnly, sortBy]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset page when category changes
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on search
  };

  // Handle price range change
  const handlePriceRangeChange = (e, index) => {
    const newPriceRange = [...priceRange];
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
        newPriceRange[index] = value;
        // Ensure min is not greater than max
        if (index === 0 && value > newPriceRange[1]) {
            newPriceRange[1] = value;
        }
        if (index === 1 && value < newPriceRange[0]) {
            newPriceRange[0] = value;
        }
        setPriceRange(newPriceRange);
        setCurrentPage(1); // Reset page on price change
    }
  };

  // Handle installment only toggle
  const handleInstallmentOnlyChange = () => {
    setInstallmentOnly(!installmentOnly);
    setCurrentPage(1); // Reset page on filter change
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // No page reset needed for sorting only the current page's data
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Function to render the main content area (loading, error, products, or no results)
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <i className="bi bi-arrow-repeat text-4xl text-primary-600 animate-spin"></i>
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      );
    }
    if (filteredProducts.length > 0) {
      return (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                <i className="bi bi-chevron-left mr-1"></i> Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Next <i className="bi bi-chevron-right ml-1"></i>
              </button>
            </div>
          )}
        </>
      );
    }
    // No products found after filtering
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <i className="bi bi-search text-gray-400 text-5xl"></i>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
        <button
          onClick={() => {
            setSelectedCategory('All');
            setSearchTerm('');
            setPriceRange([0, 5000]);
            setInstallmentOnly(false);
            setSortBy('default');
            setCurrentPage(1); // Reset page on filter reset
            // Optionally re-fetch immediately if needed, or let useEffect handle it
            // fetchProducts(1); 
          }}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Reset Filters
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <p className="text-gray-600">Browse our collection of products available for purchase with installment options.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Search</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-search text-gray-400"></i>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center">
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className={`flex items-center w-full px-2 py-1.5 text-sm rounded-md ${
                      selectedCategory === category
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category === 'All' && <i className="bi bi-grid mr-2"></i>}
                    {category === 'Smartphones' && <i className="bi bi-phone mr-2"></i>}
                    {category === 'Laptops' && <i className="bi bi-laptop mr-2"></i>}
                    {category === 'Gaming' && <i className="bi bi-controller mr-2"></i>}
                    {category === 'Tablets' && <i className="bi bi-tablet mr-2"></i>}
                    {category === 'Cameras' && <i className="bi bi-camera mr-2"></i>}
                    {category === 'Audio' && <i className="bi bi-headphones mr-2"></i>}
                    {category === 'TVs' && <i className="bi bi-tv mr-2"></i>}
                    {category}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Range</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">${priceRange[0]}</span>
                <span className="text-sm text-gray-500">${priceRange[1]}</span>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">Min</label>
                  <input
                    type="number"
                    id="min-price"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">Max</label>
                  <input
                    type="number"
                    id="max-price"
                    min={priceRange[0]}
                    max="5000" // Adjusted max price
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Options</h2>
            <div className="flex items-center">
              <input
                id="installment-only"
                type="checkbox"
                checked={installmentOnly}
                onChange={handleInstallmentOnlyChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="installment-only" className="ml-2 block text-sm text-gray-700">
                Installment Available Only
              </label>
            </div>
          </div>
        </div>
        
        {/* Products Grid Area */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                Showing {filteredProducts.length} of <span className="font-medium">{totalProducts}</span> products
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Render loading, error, or product grid */}
          {renderContent()} 
          
        </div>
      </div>
    </div>
  );
};

export default Products;
