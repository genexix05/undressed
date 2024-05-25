import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
}

const Saved: React.FC = () => {
  const { accessToken } = useAuth();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/saved-products', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setSavedProducts(response.data);
      } catch (err) {
        console.error('Error fetching saved products:', err);
        setError('An error occurred while fetching saved products');
      }
    };

    fetchSavedProducts();
  }, [accessToken]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (savedProducts.length === 0) {
    return <div className="text-center">No saved products</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Saved Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {savedProducts.map(product => (
          product && product.images && product.images[0] ? (
            <div key={product.id} className="bg-white shadow p-4 rounded-lg">
              <img src={product.images[0]} alt={product.name} className="w-full h-48 object-contain mb-4" />
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-700">${product.price}</p>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default Saved;
