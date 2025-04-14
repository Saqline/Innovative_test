import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  // Mock data for settings
  const generalSettings = {
    storeName: 'Innovative Skills',
    storeEmail: 'info@Innovative Skills.com',
    storePhone: '(123) 456-7890',
    storeAddress: '123 Main St, New York, NY 10001',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'America/New_York'
  };
  
  const installmentSettings = {
    defaultInstallmentPeriods: [3, 6, 12],
    defaultInterestRates: [0, 5, 10],
    minInstallmentAmount: 50,
    maxInstallmentPeriods: 24,
    latePaymentFee: 25,
    latePaymentGracePeriod: 3,
    reminderDays: 3
  };
  
  const emailSettings = {
    emailProvider: 'smtp',
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpUsername: 'notifications@Innovative Skills.com',
    smtpPassword: '********',
    senderName: 'Innovative Skills Notifications',
    senderEmail: 'notifications@Innovative Skills.com',
    enableEmailNotifications: true
  };
  
  const userSettings = {
    enableUserRegistration: true,
    requireEmailVerification: true,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    sessionTimeout: 60
  };
  
  // Validation schemas
  const generalValidationSchema = Yup.object({
    storeName: Yup.string().required('Store name is required'),
    storeEmail: Yup.string().email('Invalid email address').required('Store email is required'),
    storePhone: Yup.string().required('Store phone is required'),
    storeAddress: Yup.string().required('Store address is required'),
    currency: Yup.string().required('Currency is required'),
    dateFormat: Yup.string().required('Date format is required'),
    timeZone: Yup.string().required('Time zone is required')
  });
  
  const installmentValidationSchema = Yup.object({
    defaultInstallmentPeriods: Yup.array().of(Yup.number()).required('Default installment periods are required'),
    defaultInterestRates: Yup.array().of(Yup.number()).required('Default interest rates are required'),
    minInstallmentAmount: Yup.number().min(1, 'Minimum installment amount must be at least 1').required('Minimum installment amount is required'),
    maxInstallmentPeriods: Yup.number().min(1, 'Maximum installment periods must be at least 1').required('Maximum installment periods is required'),
    latePaymentFee: Yup.number().min(0, 'Late payment fee must be at least 0').required('Late payment fee is required'),
    latePaymentGracePeriod: Yup.number().min(0, 'Late payment grace period must be at least 0').required('Late payment grace period is required'),
    reminderDays: Yup.number().min(1, 'Reminder days must be at least 1').required('Reminder days is required')
  });
  
  const emailValidationSchema = Yup.object({
    emailProvider: Yup.string().required('Email provider is required'),
    smtpHost: Yup.string().when('emailProvider', {
      is: 'smtp',
      then: Yup.string().required('SMTP host is required')
    }),
    smtpPort: Yup.number().when('emailProvider', {
      is: 'smtp',
      then: Yup.number().required('SMTP port is required')
    }),
    smtpUsername: Yup.string().when('emailProvider', {
      is: 'smtp',
      then: Yup.string().required('SMTP username is required')
    }),
    smtpPassword: Yup.string().when('emailProvider', {
      is: 'smtp',
      then: Yup.string().required('SMTP password is required')
    }),
    senderName: Yup.string().required('Sender name is required'),
    senderEmail: Yup.string().email('Invalid email address').required('Sender email is required')
  });
  
  const userValidationSchema = Yup.object({
    passwordMinLength: Yup.number().min(6, 'Password minimum length must be at least 6').required('Password minimum length is required'),
    sessionTimeout: Yup.number().min(5, 'Session timeout must be at least 5 minutes').required('Session timeout is required')
  });
  
  // Handle form submit
  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      // In a real app, this would make an API call to save the settings
      toast.success('Settings saved successfully');
      setSubmitting(false);
    }, 1000);
  };
  
  // Handle test email
  const handleTestEmail = () => {
    // In a real app, this would make an API call to send a test email
    toast.info('Test email sent. Please check your inbox.');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Configure your application settings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'general'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'installment'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('installment')}
          >
            Installment
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'email'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'user'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('user')}
          >
            User
          </button>
        </div>
        
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
              <Formik
                initialValues={generalSettings}
                validationSchema={generalValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                          Store Name
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="storeName"
                            id="storeName"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="storeName" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">
                          Store Email
                        </label>
                        <div className="mt-1">
                          <Field
                            type="email"
                            name="storeEmail"
                            id="storeEmail"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="storeEmail" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700">
                          Store Phone
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="storePhone"
                            id="storePhone"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="storePhone" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                          Currency
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            name="currency"
                            id="currency"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                          </Field>
                          <ErrorMessage name="currency" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">
                          Store Address
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="storeAddress"
                            id="storeAddress"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="storeAddress" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                          Date Format
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            name="dateFormat"
                            id="dateFormat"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </Field>
                          <ErrorMessage name="dateFormat" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
                          Time Zone
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            name="timeZone"
                            id="timeZone"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="America/New_York">America/New_York (UTC-05:00)</option>
                            <option value="America/Chicago">America/Chicago (UTC-06:00)</option>
                            <option value="America/Denver">America/Denver (UTC-07:00)</option>
                            <option value="America/Los_Angeles">America/Los_Angeles (UTC-08:00)</option>
                            <option value="Europe/London">Europe/London (UTC+00:00)</option>
                            <option value="Europe/Paris">Europe/Paris (UTC+01:00)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (UTC+09:00)</option>
                          </Field>
                          <ErrorMessage name="timeZone" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                            Saving...
                          </span>
                        ) : (
                          'Save Settings'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          
          {/* Installment Settings */}
          {activeTab === 'installment' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Installment Settings</h2>
              <Formik
                initialValues={installmentSettings}
                validationSchema={installmentValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Default Installment Options</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Configure the default installment periods and their corresponding interest rates.
                      </p>
                      
                      <div className="space-y-4">
                        {values.defaultInstallmentPeriods.map((period, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="w-1/3">
                              <label htmlFor={`period-${index}`} className="block text-sm font-medium text-gray-700">
                                Period (months)
                              </label>
                              <input
                                type="number"
                                id={`period-${index}`}
                                value={period}
                                onChange={(e) => {
                                  const newPeriods = [...values.defaultInstallmentPeriods];
                                  newPeriods[index] = parseInt(e.target.value);
                                  setFieldValue('defaultInstallmentPeriods', newPeriods);
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                            <div className="w-1/3">
                              <label htmlFor={`rate-${index}`} className="block text-sm font-medium text-gray-700">
                                Interest Rate (%)
                              </label>
                              <input
                                type="number"
                                id={`rate-${index}`}
                                value={values.defaultInterestRates[index]}
                                onChange={(e) => {
                                  const newRates = [...values.defaultInterestRates];
                                  newRates[index] = parseFloat(e.target.value);
                                  setFieldValue('defaultInterestRates', newRates);
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              />
                            </div>
                            <div className="w-1/3 flex items-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const newPeriods = values.defaultInstallmentPeriods.filter((_, i) => i !== index);
                                  const newRates = values.defaultInterestRates.filter((_, i) => i !== index);
                                  setFieldValue('defaultInstallmentPeriods', newPeriods);
                                  setFieldValue('defaultInterestRates', newRates);
                                }}
                                className="mt-1 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                <i className="bi bi-trash mr-1"></i>
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue('defaultInstallmentPeriods', [...values.defaultInstallmentPeriods, 0]);
                            setFieldValue('defaultInterestRates', [...values.defaultInterestRates, 0]);
                          }}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <i className="bi bi-plus mr-1"></i>
                          Add Option
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="minInstallmentAmount" className="block text-sm font-medium text-gray-700">
                          Minimum Installment Amount ($)
                        </label>
                        <div className="mt-1">
                          <Field
                            type="number"
                            name="minInstallmentAmount"
                            id="minInstallmentAmount"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="minInstallmentAmount" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="maxInstallmentPeriods" className="block text-sm font-medium text-gray-700">
                          Maximum Installment Periods
                        </label>
                        <div className="mt-1">
                          <Field
                            type="number"
                            name="maxInstallmentPeriods"
                            id="maxInstallmentPeriods"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="maxInstallmentPeriods" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="latePaymentFee" className="block text-sm font-medium text-gray-700">
                          Late Payment Fee ($)
                        </label>
                        <div className="mt-1">
                          <Field
                            type="number"
                            name="latePaymentFee"
                            id="latePaymentFee"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="latePaymentFee" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="latePaymentGracePeriod" className="block text-sm font-medium text-gray-700">
                          Late Payment Grace Period (days)
                        </label>
                        <div className="mt-1">
                          <Field
                            type="number"
                            name="latePaymentGracePeriod"
                            id="latePaymentGracePeriod"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="latePaymentGracePeriod" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700">
                          Payment Reminder Days Before Due
                        </label>
                        <div className="mt-1">
                          <Field
                            type="number"
                            name="reminderDays"
                            id="reminderDays"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="reminderDays" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                            Saving...
                          </span>
                        ) : (
                          'Save Settings'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          
          {/* Email Settings */}
          {activeTab === 'email' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h2>
              <Formik
                initialValues={emailSettings}
                validationSchema={emailValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="emailProvider" className="block text-sm font-medium text-gray-700">
                          Email Provider
                        </label>
                        <div className="mt-1">
                          <Field
                            as="select"
                            name="emailProvider"
                            id="emailProvider"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="smtp">SMTP</option>
                            <option value="sendgrid">SendGrid</option>
                            <option value="mailgun">Mailgun</option>
                            <option value="ses">Amazon SES</option>
                          </Field>
                          <ErrorMessage name="emailProvider" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <div className="flex items-center h-5 mt-8">
                          <Field
                            type="checkbox"
                            name="enableEmailNotifications"
                            id="enableEmailNotifications"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                          <label htmlFor="enableEmailNotifications" className="ml-3 block text-sm font-medium text-gray-700">
                            Enable Email Notifications
                          </label>
                        </div>
                      </div>
                      
                      {values.emailProvider === 'smtp' && (
                        <>
                          <div className="sm:col-span-3">
                            <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                              SMTP Host
                            </label>
                            <div className="mt-1">
                              <Field
                                type="text"
                                name="smtpHost"
                                id="smtpHost"
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                              <ErrorMessage name="smtpHost" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                              SMTP Port
                            </label>
                            <div className="mt-1">
                              <Field
                                type="number"
                                name="smtpPort"
                                id="smtpPort"
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                              <ErrorMessage name="smtpPort" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                              SMTP Username
                            </label>
                            <div className="mt-1">
                              <Field
                                type="text"
                                name="smtpUsername"
                                id="smtpUsername"
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                              <ErrorMessage name="smtpUsername" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                              SMTP Password
                            </label>
                            <div className="mt-1">
                              <Field
                                type="password"
                                name="smtpPassword"
                                id="smtpPassword"
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                              <ErrorMessage name="smtpPassword" component="div" className="mt-1 text-sm text-red-600" />
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="senderName" className="block text-sm font-medium text-gray-700">
                          Sender Name
                        </label>
                        <div className="mt-1">
                          <Field
                            type="text"
                            name="senderName"
                            id="senderName"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="senderName" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700">
                          Sender Email
                        </label>
                        <div className="mt-1">
                          <Field
                            type="email"
                            name="senderEmail"
                            id="senderEmail"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="senderEmail" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Email Templates</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Configure the email templates for different notifications.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Welcome Email</h4>
                            <p className="text-xs text-gray-500">Sent to new customers after registration</p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Edit Template
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Payment Confirmation</h4>
                            <p className="text-xs text-gray-500">Sent after a successful payment</p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Edit Template
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Payment Reminder</h4>
                            <p className="text-xs text-gray-500">Sent before a payment is due</p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Edit Template
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Late Payment Notification</h4>
                            <p className="text-xs text-gray-500">Sent when a payment is overdue</p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Edit Template
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={handleTestEmail}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <i className="bi bi-envelope mr-2"></i>
                        Send Test Email
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                            Saving...
                          </span>
                        ) : (
                          'Save Settings'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          
          {/* User Settings */}
          {activeTab === 'user' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">User Settings</h2>
              <Formik
                initialValues={userSettings}
                validationSchema={userValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Registration Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Field
                            type="checkbox"
                            name="enableUserRegistration"
                            id="enableUserRegistration"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                          <label htmlFor="enableUserRegistration" className="ml-3 block text-sm font-medium text-gray-700">
                            Enable User Registration
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <Field
                            type="checkbox"
                            name="requireEmailVerification"
                            id="requireEmailVerification"
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                          />
                          <label htmlFor="requireEmailVerification" className="ml-3 block text-sm font-medium text-gray-700">
                            Require Email Verification
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h3>
                      <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="passwordMinLength" className="block text-sm font-medium text-gray-700">
                            Minimum Length
                          </label>
                          <div className="mt-1">
                            <Field
                              type="number"
                              name="passwordMinLength"
                              id="passwordMinLength"
                              min="6"
                              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                            <ErrorMessage name="passwordMinLength" component="div" className="mt-1 text-sm text-red-600" />
                          </div>
                        </div>
                        
                        <div className="space-y-4 mt-6">
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="passwordRequireUppercase"
                              id="passwordRequireUppercase"
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                            <label htmlFor="passwordRequireUppercase" className="ml-3 block text-sm font-medium text-gray-700">
                              Require Uppercase Letter
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="passwordRequireNumber"
                              id="passwordRequireNumber"
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                            <label htmlFor="passwordRequireNumber" className="ml-3 block text-sm font-medium text-gray-700">
                              Require Number
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name="passwordRequireSpecial"
                              id="passwordRequireSpecial"
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                            <label htmlFor="passwordRequireSpecial" className="ml-3 block text-sm font-medium text-gray-700">
                              Require Special Character
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                          Session Timeout (minutes)
                        </label>
                        <div className="mt-1">
                          <Field
                            type="number"
                            name="sessionTimeout"
                            id="sessionTimeout"
                            min="5"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          <ErrorMessage name="sessionTimeout" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                            Saving...
                          </span>
                        ) : (
                          'Save Settings'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
