import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Get the current page title based on the path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/admin/products')) return 'Products Management';
    if (path.includes('/admin/categories')) return 'Categories Management';
    if (path.includes('/admin/purchases')) return 'Purchase Management';
    if (path.includes('/admin/customers')) return 'Customer Management';
    if (path.includes('/admin/installments')) return 'Installment Management';
    if (path.includes('/admin/reports')) return 'Reports';
    // if (path.includes('/admin/settings')) return 'Settings';
    return 'Admin Panel';
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white shadow-lg md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-center h-16 bg-primary-600">
          <div className="flex items-center">
            <i className="bi bi-shop text-white text-2xl mr-2"></i>
            <span className="text-white font-semibold text-lg">Innovative Skills Admin</span>
          </div>
        </div>
        <nav className="mt-5 px-2">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => 
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-speedometer2 mr-3 text-lg"></i>
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => 
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-6 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-box-seam mr-3 text-lg"></i>
            Products
          </NavLink>
          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => 
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-tags mr-3 text-lg"></i>
            Categories
          </NavLink>
           <NavLink
            to="/admin/purchases"
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-cart-check mr-3 text-lg"></i>
            Purchases
          </NavLink>
          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-bell mr-3 text-lg"></i>
            Notifications
          </NavLink>
          <NavLink 
            to="/admin/customers"
            className={({ isActive }) => 
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-people mr-3 text-lg"></i>
            Customers
          </NavLink>
          <NavLink 
            to="/admin/installments" 
            className={({ isActive }) => 
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-credit-card mr-3 text-lg"></i>
            Installments
          </NavLink>
          <NavLink 
            to="/admin/reports" 
            className={({ isActive }) => 
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-bar-chart mr-3 text-lg"></i>
            Reports
          </NavLink>
          {/* <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              `group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <i className="bi bi-gear mr-3 text-lg"></i>
            Settings
          </NavLink> */}
        </nav>
        <div className="absolute bottom-0 w-full">
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="bi bi-person-circle text-2xl text-gray-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{currentUser?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{currentUser?.email || 'admin@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <i className="bi bi-box-arrow-right mr-2"></i>
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <button
                  onClick={toggleSidebar}
                  className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
                >
                  <span className="sr-only">Open sidebar</span>
                  <i className="bi bi-list text-2xl"></i>
                </button>
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="relative inline-block">
                    <button className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <span className="sr-only">View notifications</span>
                      <i className="bi bi-bell text-xl"></i>
                    </button>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Innovative Skills Admin Panel. All rights reserved.
            </p>
            <p className="text-center text-xs text-gray-400 mt-1">
              Designed by Imran Nur
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
