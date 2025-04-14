import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(123) 456-7890',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  joinDate: '2023-01-15'
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile validation schema
  const profileValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('ZIP code is required')
  });
  
  // Password validation schema
  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required')
  });
  
  // Handle profile update
  const handleProfileUpdate = (values, { setSubmitting }) => {
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setSubmitting(false);
    }, 1000);
  };
  
  // Handle password change
  const handlePasswordChange = (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      toast.success('Password changed successfully');
      resetForm();
      setSubmitting(false);
    }, 1000);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-1/4 border-r border-gray-200">
            <div className="p-6 text-center border-b border-gray-200">
              <div className="relative inline-block">
                <img 
                  src={userData.profileImage} 
                  alt={userData.name}
                  className="h-24 w-24 rounded-full object-cover mx-auto"
                  crossOrigin="anonymous"
                />
                <button className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1 shadow-md">
                  <i className="bi bi-camera text-sm"></i>
                </button>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-800">{userData.name}</h2>
              <p className="text-sm text-gray-500">{userData.email}</p>
              <p className="text-xs text-gray-400 mt-1">Member since {formatDate(userData.joinDate)}</p>
            </div>
            
            <div className="p-4">
              <button
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-person mr-2"></i>
                Profile Information
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'security'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <i className="bi bi-shield-lock mr-2"></i>
                Security
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <i className="bi bi-bell mr-2"></i>
                Notifications
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'payment'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('payment')}
              >
                <i className="bi bi-credit-card mr-2"></i>
                Payment Methods
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4 p-6">
            {/* Profile Information */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <i className="bi bi-pencil mr-1"></i>
                      Edit Profile
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <Formik
                    initialValues={userData}
                    validationSchema={profileValidationSchema}
                    onSubmit={handleProfileUpdate}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Full Name
                            </label>
                            <Field
                              type="text"
                              name="name"
                              id="name"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email Address
                            </label>
                            <Field
                              type="email"
                              name="email"
                              id="email"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                              Phone Number
                            </label>
                            <Field
                              type="text"
                              name="phone"
                              id="phone"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                              Address
                            </label>
                            <Field
                              type="text"
                              name="address"
                              id="address"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                              City
                            </label>
                            <Field
                              type="text"
                              name="city"
                              id="city"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                State
                              </label>
                              <Field
                                type="text"
                                name="state"
                                id="state"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                              <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                            <div>
                              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                                ZIP Code
                              </label>
                              <Field
                                type="text"
                                name="zipCode"
                                id="zipCode"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                              <ErrorMessage name="zipCode" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                                Saving...
                              </span>
                            ) : (
                              'Save Changes'
                            )}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.address}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">City</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.city}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">State / ZIP</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData.state}, {userData.zipCode}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            )}
            
            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
                  <Formik
                    initialValues={{
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }}
                    validationSchema={passwordValidationSchema}
                    onSubmit={handlePasswordChange}
                  >
                    {({ isSubmitting }) => (
                      <Form className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <Field
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                          <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <Field
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                          <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <Field
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                          <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                                Updating...
                              </span>
                            ) : (
                              'Update Password'
                            )}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Enable Two-Factor Authentication
                  </button>
                </div>
              </div>
            )}
            
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="payment-reminders"
                              name="payment-reminders"
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="payment-reminders" className="font-medium text-gray-700">
                              Payment Reminders
                            </label>
                            <p className="text-gray-500">
                              Receive email notifications about upcoming installment payments.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="payment-confirmations"
                              name="payment-confirmations"
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="payment-confirmations" className="font-medium text-gray-700">
                              Payment Confirmations
                            </label>
                            <p className="text-gray-500">
                              Receive email confirmations when a payment is processed.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="account-updates"
                              name="account-updates"
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="account-updates" className="font-medium text-gray-700">
                              Account Updates
                            </label>
                            <p className="text-gray-500">
                              Receive email notifications about important account updates.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="marketing-emails"
                              name="marketing-emails"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="marketing-emails" className="font-medium text-gray-700">
                              Marketing Emails
                            </label>
                            <p className="text-gray-500">
                              Receive promotional emails about new products and special offers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">SMS Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="sms-payment-reminders"
                              name="sms-payment-reminders"
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="sms-payment-reminders" className="font-medium text-gray-700">
                              Payment Reminders
                            </label>
                            <p className="text-gray-500">
                              Receive SMS notifications about upcoming installment payments.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="sms-payment-confirmations"
                              name="sms-payment-confirmations"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="sms-payment-confirmations" className="font-medium text-gray-700">
                              Payment Confirmations
                            </label>
                            <p className="text-gray-500">
                              Receive SMS confirmations when a payment is processed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment Methods */}
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Methods</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Saved Payment Methods</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-md p-4 bg-white">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <i className="bi bi-credit-card text-gray-400 text-xl mr-3"></i>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Visa ending in 4242</p>
                            <p className="text-xs text-gray-500">Expires 12/24</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-4 bg-white">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <i className="bi bi-credit-card text-gray-400 text-xl mr-3"></i>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Mastercard ending in 5678</p>
                            <p className="text-xs text-gray-500">Expires 08/25</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <i className="bi bi-plus mr-2"></i>
                      Add Payment Method
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Billing Address</h3>
                  
                  <div className="border border-gray-200 rounded-md p-4 bg-white">
                    <p className="text-sm text-gray-800">{userData.name}</p>
                    <p className="text-sm text-gray-600">{userData.address}</p>
                    <p className="text-sm text-gray-600">{userData.city}, {userData.state} {userData.zipCode}</p>
                    <p className="text-sm text-gray-600">{userData.phone}</p>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <i className="bi bi-pencil mr-2"></i>
                      Edit Billing Address
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
