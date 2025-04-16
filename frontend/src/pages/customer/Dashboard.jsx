import React, { useState, useEffect } from 'react';
import DashboardStats from '../../components/customer/DashboardStats';
import InstallmentCard from '../../components/customer/InstallmentCard';
import PaymentHistory from '../../components/customer/PaymentHistory';
import Cart from '../../components/customer/Cart';
import { Link } from 'react-router-dom';
import { getUserPurchases, getUserInstallments } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [activeInstallments, setActiveInstallments] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [purchasesData, installmentsData] = await Promise.all([
          getUserPurchases(1, 10),
          getUserInstallments(1, 10)
        ]);

        // Process installments data
        const installments = installmentsData.items || [];
        const activeInstallments = installments.filter(i => i.status !== 'paid');
        const recentPayments = installments.flatMap(i => i.payment_history || []);

        setActiveInstallments(activeInstallments);
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
    <div className="space-y-8">
      {/* Dashboard Stats Section */}
      <section className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <DashboardStats
            activeInstallments={activeInstallments}
            upcomingPayments={upcomingPayments}
            overduePayments={overduePayments}
          />
        </div>
      </section>

      {/* Active Installments Section */}
      <section className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Active Installments</h2>
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
      </section>

      {/* Payment History Section */}
      <section className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Payments</h2>
          <PaymentHistory payments={recentPayments} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
