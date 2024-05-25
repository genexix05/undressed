import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs'; // Import both bookmark icons

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
      if (!accessToken) {
        setError('No access token available');
        return;
      }

      try {
        console.log('Fetching saved products with token:', accessToken); // Verifica el token
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

  const handleSaveProduct = async (productId: number, isCurrentlySaved: boolean) => {
    try {
      if (isCurrentlySaved) {
        await axios.post('http://localhost:3001/api/unsave-product', { productId }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSavedProducts(savedProducts.filter(product => product.id !== productId));
      } else {
        await axios.post('http://localhost:3001/api/save-product', { productId }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const response = await axios.get(`http://localhost:3001/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setSavedProducts([...savedProducts, response.data]);
      }
    } catch (error) {
      console.error('Error saving/unsaving product:', error);
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (savedProducts.length === 0) {
    return <div className="text-center">No saved products</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        {savedProducts.map(product => (
          product && product.images && product.images[0] ? (
            <div key={product.id} className="flex items-center bg-white p-4 rounded-lg">
              <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-contain mr-4" />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-700">${product.price}</p>
              </div>
              <button
                onClick={() => handleSaveProduct(product.id, true)}
                className="text-blue-500"
              >
                <BsBookmarkFill size={24} />
              </button>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default Saved;
