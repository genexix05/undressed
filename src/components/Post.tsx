import React, { useState, useEffect } from "react";
import { FaHeart, FaShare, FaBookmark, FaCommentDots } from "react-icons/fa";
import { PostType, useAuth } from "../context/AuthContext";
import axios from "axios";

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
        <div className="mt-4 text-gray-600 text-sm">
          <p className="font-bold">{title}</p>
          <p className="text-gray-700 mb-4">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
