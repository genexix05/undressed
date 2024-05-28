import React, { useState, useEffect } from "react";
import { FaHeart, FaShare } from "react-icons/fa";
import { PostType, useAuth } from "../context/AuthContext";
import axios from "axios";
import Modal from 'react-modal';

const customStyles = {
  content: {
    width: 'auto',
    maxWidth: '800px',
    maxHeight: '0vh',
    margin: 'auto',
    padding: '0',
    border: 'none',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const Post: React.FC<PostType> = ({
  id,
  title,
  content,
  brandName,
  brandLogo,
  images,
  createdAt,
}) => {
  const { accessToken } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isContentTruncated, setIsContentTruncated] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/posts/${id}/status`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setLiked(response.data.liked);
        setSaved(response.data.saved);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, [id, accessToken]);

  const toggleLike = async () => {
    try {
      if (liked) {
        await axios.post(
          `http://localhost:3001/api/posts/${id}/unlike`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } else {
        await axios.post(
          `http://localhost:3001/api/posts/${id}/like`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Error toggling like");
    }
  };

  const toggleSave = async () => {
    try {
      if (saved) {
        await axios.post(
          `http://localhost:3001/api/products/${id}/unsave`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } else {
        await axios.post(
          `http://localhost:3001/api/products/${id}/save`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
      setSaved(!saved);
    } catch (error) {
      console.error("Error toggling save:", error);
      alert("Error toggling save");
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleReadMore = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg mb-6 p-4 w-3/4 mx-auto" key={id}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={`http://localhost:3001${brandLogo}`}
            alt={`${brandName} logo`}
            className="h-10 w-10 rounded-full mr-3"
          />
          <h2 className="font-bold text-xl">{brandName}</h2>
        </div>
        <div className="text-gray-500 text-sm">
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      {images && images.length > 0 && (
        <div className="relative mb-4">
          <div className="relative pb-9/16">
            <img
              className="absolute h-full w-full object-contain rounded-md"
              src={`http://localhost:3001${images[currentImageIndex]}`}
              alt={`Post ${id} - Image ${currentImageIndex}`}
            />
          </div>
          {images.length > 1 && (
            <>
              <button onClick={handlePrevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2">{"<"}</button>
              <button onClick={handleNextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2">{">"}</button>
            </>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLike}
            className={`text-${liked ? "red" : "gray"}-500 hover:text-${liked ? "red" : "gray"}-700`}
          >
            <FaHeart size={20} />
          </button>
          <button className="text-purple-500 hover:text-purple-700">
            <FaShare size={20} />
          </button>
        </div>
        <div className="mt-4 text-gray-600 text-sm ">
          <p className="font-bold text-right">{title}</p>
          <div className="text-gray-700 mb-4 text-right whitespace-pre-wrap">
            {isContentTruncated ? `${content.substring(0, 50)}...` : content}
            {content.length > 100 && (
              <span
                onClick={handleReadMore}
                className="text-blue-500 cursor-pointer"
              >
                {isContentTruncated ? " Ver más" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Post Modal" style={customStyles}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl h-2/3 flex relative mt-5">
            <div className="flex-1 bg-gray-300 relative">
              {images && images.length > 0 && (
                <div className="relative w-full h-full">
                  <img src={`http://localhost:3001${images[currentImageIndex]}`} alt={`preview ${currentImageIndex}`} className="w-full h-full object-contain"/>
                  {images.length > 1 && (
                    <>
                      <button onClick={handlePrevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2">{"<"}</button>
                      <button onClick={handleNextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2">{">"}</button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 p-6 bg-gray-100 relative flex flex-col">
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-900 text-2xl font-bold">&times;</button>
              <div className="flex items-center mb-4">
                <img src={`http://localhost:3001${brandLogo}`} alt={brandName} className="h-10 w-10 rounded-full mr-2" />
                <h2 className="text-xl font-bold text-gray-900">{brandName}</h2>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2> {/* Título de la publicación en negrita */}
              <div className="text-gray-700 mt-2 whitespace-pre-wrap text-sm flex-1 overflow-y-auto"> {/* Contenido con letra más pequeña */}
                {content}
              </div>
              <button onClick={closeModal} className="mt-4 text-white py-2 w-full px-4 uppercase rounded bg-gray-900 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5 self-end">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Post;
