import React, { useState, useEffect } from 'react';
import DashboardStats from '../../components/customer/DashboardStats';
import InstallmentCard from '../../components/customer/InstallmentCard';
import PaymentHistory from '../../components/customer/PaymentHistory';
import { Link } from 'react-router-dom';
import { getUserPurchases, getUserInstallments } from '../../services/api'; // Assuming these are still needed for other parts
import { toast } from 'react-toastify';

const Dashboard = () => {
  // Removed stats state
  const [activeInstallments, setActiveInstallments] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]); // Assuming this is still needed for the table
  const [overduePayments, setOverduePayments] = useState([]); // Assuming this is still needed for the reminder
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [purchasesData, installmentsData] = await Promise.all([
          getUserPurchases(1, 10), // Fetch first page of purchases
          getUserInstallments(1, 10) // Fetch first page of installments
        ]);

        // Process purchases data
        const purchases = purchasesData.items || [];
        const completedPayments = purchases.filter(p => p.status === 'paid').length;
        const upcomingPayments = purchases.filter(p => p.status === 'pending').length;
        // Removed stats calculation

        // Process installments data (assuming still needed for other sections)
        const installments = installmentsData.items || [];
        const activeInstallments = installments.filter(i => i.status !== 'paid');
        const recentPayments = installments.flatMap(i => i.payment_history || []); // Assuming PaymentHistory component uses this

        setActiveInstallments(activeInstallments);
        // Assuming the upcoming/overdue logic below is still needed for other parts of the dashboard
        setUpcomingPayments(activeInstallments.filter(i => i.status === 'pending'));
        setOverduePayments(activeInstallments.filter(i => i.status === 'overdue'));
        setRecentPayments(recentPayments);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data.');
        toast.error(err.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your installments.</p>
      </div>

      {/* Dashboard Stats - No longer passing stats prop */}
      <DashboardStats />

      {/* Active Installments */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Active Installments</h2>
          <Link
            to="/customer/installments"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            View All
            <i className="bi bi-chevron-right ml-1"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeInstallments.map(installment => (
            <InstallmentCard key={installment.id} installment={installment} />
          ))}
        </div>
      </div>

      {/* Payment Reminder */}
      {overduePayments.length > 0 && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="bi bi-exclamation-triangle text-red-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Payment Overdue</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  You have overdue payments. Please make the payments as soon as possible to avoid additional charges.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button className="bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Payments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Payments</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingPayments
                  .sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date))
                  .map(installment => (
                    <tr key={installment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={installment.product?.image_url || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product"}
                              alt={installment.product?.name}
                              crossOrigin="anonymous"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{installment.product?.name}</div>
                            <div className="text-sm text-gray-500">
                              Installment {installment.installment_number} of {installment.total_installments}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(installment.next_due_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.ceil((new Date(installment.next_due_date) - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${(installment.total_amount / installment.total_installments).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">Pay Now</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Payment History */}
      <div className="mb-8">
        <PaymentHistory payments={recentPayments} />
      </div>
    </div>
  );
};

export default Dashboard;
