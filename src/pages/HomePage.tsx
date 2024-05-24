import React, { useEffect, useState } from 'react';
import useeAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import CreatePostForm from '../components/CreatePostForm';
import { useAuth } from "../context/AuthContext";
import PostsList from '../components/PostsList';
import Sidebar from '../components/Sidebar'; // Importa el Sidebar

const HomePage: React.FC = () => {
  const { auth, refreshToken } = useeAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userRole, isInBrand } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!auth.accessToken) {
      refreshToken();
    }
  }, [auth, refreshToken]);

  return (
    <div className="flex">
      <div className="fixed left-0 top-0 h-screen flex flex-col items-center w-1/4 justify-center p-4">
        <Sidebar />
      </div>
      <div className="flex flex-col items-center w-3/4 ml-auto">
        {userRole === 'brand' && isInBrand && (
          <button onClick={openModal} className="mt-4 text-blue-600">
            Crear Publicación
          </button>
        )}
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <CreatePostForm closeModal={closeModal} />
        </Modal>
        <PostsList />
      </div>
    </div>
  );
};

export default HomePage;
