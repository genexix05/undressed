import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Modal from 'react-modal';

interface BrandInfo {
  id: number;
  name: string;
  description: string;
  logo: string;
  followers: number;
  posts: number;
  likes: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  images: string[];
}

const BrandProfile: React.FC = () => {
  const { brandId, accessToken } = useAuth();
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandInfo = async () => {
      if (!brandId) {
        setError('Brand not found');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/brandinfo/${brandId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setBrandInfo(response.data);
      } catch (err) {
        console.error('Error fetching brand info:', err);
        setError('An error occurred while fetching brand information');
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/posts/${brandId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('An error occurred while fetching posts');
      }
    };

    const checkIfFollowing = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/check-following/${brandId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setIsFollowing(response.data.isFollowing);
      } catch (err) {
        console.error('Error checking follow status:', err);
        setError('An error occurred while checking follow status');
      }
    };

    if (brandId && accessToken) {
      fetchBrandInfo();
      fetchPosts();
      checkIfFollowing();
    }
  }, [brandId, accessToken]);

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.post(
          'http://localhost:3001/api/unfollow',
          { brandId },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/follow',
          { brandId },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow status:', err);
      setError('An error occurred while toggling follow status');
    }
  };

  const openModal = (post: Post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!brandInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-14">
      <div className="p-8 bg-white shadow mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">{brandInfo.followers}</p>
              <p className="text-gray-400">Seguidores</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">{brandInfo.posts}</p>
              <p className="text-gray-400">Publicaciones</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">{brandInfo.likes}</p>
              <p className="text-gray-400">Likes</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              {brandInfo.logo ? (
                <img src={`http://localhost:3001/uploads/${brandInfo.logo}`} alt={brandInfo.name} className="w-48 h-48 rounded-full" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button
              onClick={toggleFollow}
              className={`text-white py-2 px-4 uppercase rounded ${isFollowing ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'} shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Compartir
            </button>
          </div>
        </div>
        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">{brandInfo.name}</h1>
          <p className="text-gray-500 mt-4">{brandInfo.description}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pr-10 pl-10">
          {posts.map(post => (
            <div key={post.id} className="relative cursor-pointer" onClick={() => openModal(post)}>
              <div className="relative w-full h-64 overflow-hidden">
                <img src={`http://localhost:3001/uploads/${post.images[0]}`} alt={`Post ${post.id}`} className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <p className="text-white text-xl font-semibold">{post.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedPost && (
        <Modal isOpen={!!selectedPost} onRequestClose={closeModal} contentLabel="Post Modal" className="modal" overlayClassName="overlay">
          <div className="p-4">
            <img src={`http://localhost:3001/uploads/${selectedPost.images[0]}`} alt={`Post ${selectedPost.id}`} className="w-full h-64 object-cover rounded-lg shadow-md mb-4" />
            <p className="text-gray-700">{selectedPost.content}</p>
            <button onClick={closeModal} className="mt-4 text-white py-2 px-4 uppercase rounded bg-red-500 hover:bg-red-600 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BrandProfile;
