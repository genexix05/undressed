import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import useeAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import CreatePostForm from '../components/CreatePostForm';
import { useAuth } from "../context/AuthContext";
import PostsList from '../components/PostsList';
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications'; // Importa el componente de Notificaciones
import Saved from '../components/Saved'; // Importa el componente de Guardados

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
      <Route path="notifications" element={<Notifications />} />
      <Route path="saved" element={<Saved />} />
    </Routes>
  );
};

export default HomePage;
