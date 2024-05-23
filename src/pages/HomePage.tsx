import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import CreatePostForm from '../components/CreatePostForm';
import { useAuthContext } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const { auth, refreshToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userRole, isInBrand } = useAuthContext();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!auth.accessToken) {
      refreshToken();
    }
  }, [auth, refreshToken]);

  return (
    <div>
      <h1>Bienvenido a la página de inicio</h1>
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
