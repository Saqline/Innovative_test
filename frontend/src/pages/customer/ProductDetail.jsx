import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById } from '../../services/api/products';
import { addToCart } from '../../services/api/cart'; // Import the addToCart function

// Placeholder image if product image is missing
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // New state for tracking API call
  // Note: Installment options are not part of the ProductResponse from the backend API
  // We'll need a separate mechanism or predefined rules if installments are needed here.
  // const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch product details.');
        toast.error(err.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    // Ensure value is a number and within stock limits
    if (!isNaN(value) && value > 0 && (!product || value <= product.stock)) {
      setQuantity(value);
    } else if (!isNaN(value) && value > 0 && product && value > product.stock) {
      setQuantity(product.stock); // Set to max stock if input exceeds
    } else if (!isNaN(value) && value <= 0) {
      setQuantity(1); // Reset to 1 if input is zero or negative
    }
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  // const handleInstallmentChange = (option) => {
  //   setSelectedInstallment(option);
  // };

const handleBuyNow = () => {
  if (product) { // Check if product exists before navigating
    navigate(`/customer/checkout/${product.id}`, {
      state: {
        product,
        quantity,
      }
    });
  } else {
    toast.error('Product details not available.');
  }
};

  const handleAddToCart = async () => {
    if (!product) {
      toast.error('Product details not available.');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock.`);
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart (quantity: ${quantity})`);
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="bi bi-arrow-repeat text-4xl text-primary-600 animate-spin"></i>
      </div>
    );
  }

  if (error) {
     return (
      <div className="text-center py-12">
        <i className="bi bi-exclamation-circle text-red-500 text-5xl"></i>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Error Loading Product</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/customer/products')}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <i className="bi bi-question-circle text-gray-400 text-5xl"></i>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/customer/products')}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // Simplified installment calculation placeholder (if needed later)
  // const calculateInstallmentAmount = () => {
  //   if (!selectedInstallment) return 0;
  //   // ... calculation logic ...
  // };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/customer/products')}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <i className="bi bi-arrow-left mr-1"></i>
          Back to Products
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div>
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.image_url || PLACEHOLDER_IMAGE}
                alt={product.name}
                className="w-full h-80 object-contain"
                onError={(e) => { e.target.onerror = null; e.target.src=PLACEHOLDER_IMAGE }} // Handle broken image links
              />
            </div>
            {/* Image gallery removed as API provides single image_url */}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

            {/* Rating/Reviews removed - not in API response */}

            <div className="mt-4">
              <span className="text-3xl font-bold text-primary-600">${product.price ? product.price.toFixed(2) : 'N/A'}</span>
              {/* Installment text simplified */}
              {/* {product.installmentAvailable && ( */}
                <span className="ml-2 text-sm text-gray-500">
                  Installment options may be available at checkout.
                </span>
              {/* )} */}
            </div>

            <div className="mt-4">
              <p className="text-gray-600">{product.description || 'No description available.'}</p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>

            
            </div>

            {product.stock > 0 ? (
              <div className="mt-6">
                <div className="flex items-center mb-4"> {/* Added margin-bottom */}
                  <span className="text-sm font-medium text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="number" // Keep as number but handle validation in functions
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-12 text-center border-0 focus:ring-0"
                      readOnly // Prevent direct typing, use buttons
                    />
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>

                {/* Installment options selection removed - data not available */}

                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={handleBuyNow} // Simplified - directly go to checkout
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Proceed to Checkout {/* Changed button text */}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product || product.stock === 0}
                    className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      (isAddingToCart || !product || product.stock === 0) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isAddingToCart ? (
                      <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                    ) : (
                      <i className="bi bi-cart-plus mr-2"></i>
                    )}
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ) : (
                 <div className="mt-6">
                    <p className="text-red-600 font-medium">Currently Out of Stock</p>
                 </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs - Simplified */}
        <div className="border-t border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            {/* Specifications and Reviews tabs removed - data not available */}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-600 mb-4">{product.description || 'No description available.'}</p>
                {/* Key Features removed - data not available */}
              </div>
            )}
            {/* Specifications and Reviews content removed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
