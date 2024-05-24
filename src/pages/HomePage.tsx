import React, { useEffect, useState } from 'react';
import useeAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import CreatePostForm from '../components/CreatePostForm';
import { useAuth } from "../context/AuthContext";

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
    <div>
      {userRole === 'brand' && isInBrand && (
        <button onClick={openModal} className="mt-4 text-blue-600">
          Crear Publicación
        </button>
      )}
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <CreatePostForm closeModal={closeModal} />
      </Modal>
    </div>
  );
};


export default HomePage;
