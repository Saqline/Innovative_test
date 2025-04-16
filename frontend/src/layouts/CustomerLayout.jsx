import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { getCart } from '../services/api/cart';
import { useAuth } from '../contexts/AuthContext';

const CustomerLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cartData = await getCart();
        setCartItemCount(cartData.total_items);
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
      }
    };

    fetchCartCount();

    // Add event listener for cart updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cart-updated', handleCartUpdate);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <i className="bi bi-shop text-primary-600 text-3xl mr-2"></i>
                <span className="font-bold text-xl text-gray-800">Innovative Skills</span>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink 
                  to="/customer" 
                  end
                  className={({ isActive }) => 
                    isActive 
                      ? "border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink 
                  to="/customer/products" 
                  className={({ isActive }) => 
                    isActive 
                      ? "border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  }
                >
                  Products
                </NavLink>
                <NavLink 
                  to="/customer/installments" 
                  className={({ isActive }) => 
                    isActive 
                      ? "border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  }
                >
                  My Installments
                </NavLink>
                <NavLink 
                  to="/customer/purchases" 
                  className={({ isActive }) => 
                    isActive 
                      ? "border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  }
                >
                  My Purchases
                </NavLink>
                <NavLink 
                  to="/customer/cart" 
                  className={({ isActive }) => 
                    isActive 
                      ? "border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  }
                >
                  <div className="flex items-center">
                    <i className="bi bi-cart3 text-xl mr-1"></i>
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </NavLink>
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <NavLink 
                to="/customer/cart" 
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 mr-4"
              >
                <div className="relative">
                  <i className="bi bi-cart3 text-xl"></i>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </NavLink>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <NavLink 
                    to="/customer/profile" 
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 mr-4"
                  >
                    <i className="bi bi-person-circle text-xl mr-1"></i>
                    <span>{currentUser?.name || 'Profile'}</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <i className="bi bi-box-arrow-right mr-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open main menu</span>
                <i className={`bi ${isMobileMenuOpen ? 'bi-x' : 'bi-list'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <NavLink 
                to="/customer" 
                end
                className={({ isActive }) => 
                  isActive 
                    ? "bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" 
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/customer/products" 
                className={({ isActive }) => 
                  isActive 
                    ? "bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" 
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </NavLink>
              <NavLink 
                to="/customer/installments" 
                className={({ isActive }) => 
                  isActive 
                    ? "bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" 
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Installments
              </NavLink>
              <NavLink 
                to="/customer/purchases" 
                className={({ isActive }) => 
                  isActive 
                    ? "bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" 
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Purchases
              </NavLink>
              <NavLink 
                to="/customer/cart" 
                className={({ isActive }) => 
                  isActive 
                    ? "bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" 
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <i className="bi bi-cart3 mr-2"></i>
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </NavLink>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <i className="bi bi-person-circle text-2xl text-gray-400"></i>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{currentUser?.name || 'User'}</div>
                  <div className="text-sm font-medium text-gray-500">{currentUser?.email || 'user@example.com'}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <NavLink 
                  to="/customer/profile" 
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Profile
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <i className="bi bi-shop text-primary-600 text-2xl mr-2"></i>
              <span className="font-semibold text-gray-800">Innovative Skills</span>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Innovative Skills. All rights reserved.
              </p>
              <p className="text-center text-xs text-gray-400 mt-1">
                Designed by Imran Nur
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
