import React from 'react';
import { PostType } from '../context/AuthContext';

const Post: React.FC<PostType> = ({ title, content, username, images, createdAt }) => {
  return (
    <div className="bg-white shadow-md rounded-lg mb-4 p-4">
      <h2 className="font-bold text-xl">{title}</h2>
      <p className="text-gray-700">{content}</p>
      {images && images.map((image, index) => (
        <img key={index} src={image} alt={`Post image ${index}`} className="mt-2 w-full h-auto rounded-lg" />
      ))}
      <div className="mt-4 text-gray-600 text-sm">
        <p>Publicado por: {username}</p>
        <p>{new Date(createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Post;
