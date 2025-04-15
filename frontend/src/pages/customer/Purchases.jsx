import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { getUserPurchases } from '../../services/api';
import { formatDate } from '../../utils';
import { toast } from 'react-toastify';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching purchases...');
        const data = await getUserPurchases();
        console.log('Purchases data:', data);
        setPurchases(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch purchases.');
        toast.error(err.message || 'Failed to fetch purchases.');
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
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
      <h1 className="text-2xl font-bold text-gray-800 mb-4">My Purchases</h1>
      {purchases.length === 0 ? (
        <p className="text-gray-600">No purchases found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Purchase #{purchase.id}
              </h2>
              <p className="text-gray-500">
                Product: {purchase.product?.name || 'N/A'}
              </p>
              <p className="text-gray-500">
                Date: {formatDate(purchase.created_at)}
              </p>
              {/* Link to Installments page with purchaseId */}
              <Link
                to={`/customer/installments?purchaseId=${purchase.id}`}
                className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                View Installments
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchases;
