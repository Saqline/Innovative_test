import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Customer Pages
import CustomerLayout from './layouts/CustomerLayout';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerProducts from './pages/customer/Products';
import CustomerInstallments from './pages/customer/Installments';
import CustomerProfile from './pages/customer/Profile';
import ProductDetail from './pages/customer/ProductDetail';
import Checkout from './pages/customer/Checkout';
import PaymentSuccess from './pages/customer/PaymentSuccess';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCustomers from './pages/admin/Customers';
import AdminInstallments from './pages/admin/Installments';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import CustomerDetail from './pages/admin/CustomerDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute role="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CustomerDashboard />} />
            <Route path="products" element={<CustomerProducts />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="checkout/:id" element={<Checkout />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="installments" element={<CustomerInstallments />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="installments" element={<AdminInstallments />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
