import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { FaHeart } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  brand: string;
  color: string;
  originalPrice: number;
  discount: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const checkIfSaved = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/check-saved/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setIsSaved(response.data.isSaved);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    fetchProduct();
    checkIfSaved();
  }, [id, accessToken]);

  const handleSaveProduct = async () => {
    try {
      if (isSaved) {
        await axios.post('http://localhost:3001/api/unsave-product', { productId: id }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setIsSaved(false);
      } else {
        await axios.post('http://localhost:3001/api/save-product', { productId: id }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving/unsaving product:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const images = product.images.map(image => ({
    original: image,
    thumbnail: image,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <ImageGallery items={images} />
        </div>
        <div className="w-full md:w-1/2 pl-0 md:pl-8">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl font-semibold text-purple-600 mb-1">{product.price}€</p>
          <div className="flex items-center mb-4">
            <button className="bg-black text-white py-2 px-4 rounded flex items-center">
              Link del producto
            </button>
          </div>
          <div className="flex items-center mb-4">
            <button
              onClick={handleSaveProduct}
              className={`bg-black text-white py-2 px-4 rounded flex items-center ${isSaved ? 'bg-red-500' : 'bg-gray-500'}`}
            >
              {isSaved ? 'Guardado' : 'Guardar'}
              <FaHeart className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
