import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { generateReport } from '../../services/api/reports';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

const Reports = () => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default to 7 days ago
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]); // Default to today
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch report data from API
  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await generateReport(startDate, endDate);
      setReportData(data);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      const errorMessage = err.message || 'Failed to fetch report data.';
      setError(errorMessage);
      toast.error(errorMessage);
      setReportData(null); // Clear previous data on error
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  // Fetch data on initial load and when dates change
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency array includes fetchData which depends on startDate and endDate

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  // Handle generate report button click (optional, as it fetches on date change)
  const handleGenerateReport = () => {
    fetchData();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600">Generate financial summary reports based on date range.</p>
      </div>
      
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={loading}
              className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Report Summary */}
      {loading && <div className="text-center py-10">Loading report data...</div>}
      {error && <div className="text-center py-10 text-red-600">Error: {error}</div>}
      
      {!loading && !error && reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Weekly Paid Amount</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(reportData.weekly_paid_amount)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Weekly Due Amount</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(reportData.weekly_due_amount)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Monthly Paid Amount</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(reportData.monthly_paid_amount)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Monthly Due Amount</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(reportData.monthly_due_amount)}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && !reportData && (
         <div className="text-center py-10 text-gray-500">Select dates and generate a report to view summary data.</div>
      )}

      {/* Chart and Table removed as backend doesn't provide suitable data */}
      
    </div>
  );
};

export default Reports;
