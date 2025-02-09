import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import useAuthContext from '../hooks/useAuth'; // Corrección de typo
import Modal from '../components/Modal';
import CreatePostForm from '../components/CreatePostForm';
import { useAuth } from "../context/AuthContext";
import PostsList from '../components/PostsList';
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications'; 
import Saved from '../components/Saved';
import PostsListFollowed from '../components/PostsListFollowed';
import axios from 'axios';

const HomePage: React.FC = () => {
  const { auth, refreshToken } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userRole, isInBrand } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!auth.accessToken) {
      refreshToken();
    }

    const registerPageView = async () => {
      try {
        await axios.post('http://localhost:3001/api/page-view', {}, {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        });
      } catch (error) {
        console.error('Error registering page view:', error);
      }
    };

    if (auth.accessToken) {
      registerPageView();
    }
  }, [auth, refreshToken]);

  return (
    <div className="flex bg-gray-100">
      <div className="fixed flex flex-col items-center w-1/5 justify-center">
        <Sidebar />
      </div>
      <div className="flex flex-col items-center w-3/5 ml-auto">
        {userRole === 'brand' && isInBrand && (
          <button onClick={openModal} className="mt-4 text-purple-600">
            Crear Publicación
          </button>
        )}
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <CreatePostForm closeModal={closeModal} />
        </Modal>
        <Routes>
          <Route path="/*" element={<MainContent />} />
        </Routes>
      </div>
      <div className=" w-1/5">
        {/* Puedes agregar cualquier otro contenido aquí */}
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<PostsList />} />
      <Route path="following" element={<PostsListFollowed />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="saved" element={<Saved />} />
    </Routes>
  );
};

export default HomePage;
