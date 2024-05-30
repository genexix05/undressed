import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Modal from 'react-modal';
import { FaHeart, FaBookmark } from 'react-icons/fa';

interface UserInfo {
  id: number;
  username: string;
  profile_pic: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image_urls: string[];
  url: string;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const UserProfile: React.FC = () => {
  const { accessToken } = useAuth();
  const { userId } = useParams<{ userId: string }>(); // Usa useParams para obtener userId de la URL
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) {
        setError('User not found');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/userinfo/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('An error occurred while fetching user information');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/userproducts/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('An error occurred while fetching products');
      }
    };

    if (userId && accessToken) {
      fetchUserInfo();
      fetchProducts();
    }
  }, [userId, accessToken]);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!userInfo) {
    return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>;
  }

  return (
    <div className="p-14">
      <div className="p-8 bg-white shadow mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              {userInfo.profile_pic ? (
                <img src={`http://localhost:3001/uploads/${userInfo.profile_pic}`} alt={userInfo.username} className="w-48 h-48 rounded-full" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">{userInfo.username}</h1>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pr-10 pl-10">
          {products.map(product => (
            <div key={product.id} className="relative cursor-pointer" onClick={() => openModal(product)}>
              <div className="relative w-full h-64 overflow-hidden">
                <img src={`${product.image_urls[0]}`} alt={`Product ${product.id}`} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <p className="text-white text-xl font-semibold">{product.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedProduct && (
        <Modal isOpen={!!selectedProduct} onRequestClose={closeModal} contentLabel="Product Modal" style={customStyles}>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative w-full h-0 pb-9/16 overflow-hidden">
                <img src={`${selectedProduct.image_urls[0]}`} alt={`Product ${selectedProduct.id}`} className="absolute top-0 left-0 w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-700">{selectedProduct.name}</h2>
                  <p className="text-gray-700 mt-2">Precio: {selectedProduct.price} €</p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button className="text-gray-700 hover:text-red-500">
                    <FaHeart size={24} />
                  </button>
                  <button className="text-gray-700 hover:text-blue-500">
                    <FaBookmark size={24} />
                  </button>
                </div>
              </div>
            </div>
            <button onClick={closeModal} className="mt-4 text-white py-2 px-4 uppercase rounded bg-red-500 hover:bg-red-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserProfile;
