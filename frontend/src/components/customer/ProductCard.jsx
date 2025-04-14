import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, name, price, image_url, category, installmentAvailable } = product;
  const categoryName = category?.name || 'Uncategorized'; // Handle cases where category might be missing

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img
          src={image_url || "https://via.placeholder.com/400x300?text=Product+Image"}
          alt={name}
          className="w-full h-48 object-cover"
          crossOrigin="anonymous"
        />
        {installmentAvailable && (
          <span className="absolute top-2 right-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Installment Available
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{categoryName}</span>
        <h3 className="text-lg font-semibold text-gray-800 mt-1">{name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">${price.toFixed(2)}</span>
          <div className="flex items-center text-yellow-400">
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-half"></i>
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/customer/products/${id}`}
            className="flex-1 bg-primary-600 text-white text-center py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-300"
          >
            View Details
          </Link>
          <button className="p-2 text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100">
            <i className="bi bi-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
