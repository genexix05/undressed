import React from 'react';
import { FaHeart, FaShare, FaBookmark, FaCommentDots } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Cambiado a esta ruta
import { PostType } from '../context/AuthContext';

const Post: React.FC<PostType> = ({ id, title, content, username, images, createdAt }) => {
  return (
    <div className="bg-white shadow-md rounded-lg mb-6 p-4 w-1/3 mx-auto" key={id}>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">{username}</h2>
        <div className="text-gray-500 text-sm">{new Date(createdAt).toLocaleDateString()}</div>
      </div>
      
      {images && images.length > 0 && (
        <Swiper spaceBetween={10} slidesPerView={1} className="mb-4">
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img 
                className="w-full rounded-md" 
                src={`http://localhost:3001${image}`} 
                alt={`Post ${id} - Image ${index}`} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <button className="text-red-500 hover:text-red-700">
            <FaHeart size={20} />
          </button>
          <button className="text-blue-500 hover:text-blue-700">
            <FaShare size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <FaBookmark size={20} />
          </button>
        </div>
        <button className="flex items-center text-gray-700 hover:text-gray-900">
          <FaCommentDots size={20} className="mr-1" />
          <span>Ver comentarios</span>
        </button>
      </div>

      <div className="mt-4 text-gray-600 text-sm">
        <p>{title}</p>
        <p className="text-gray-700 mb-4">{content}</p>
      </div>
    </div>
  );
};

export default Post;
