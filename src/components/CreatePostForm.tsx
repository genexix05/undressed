import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCreatePost from '../hooks/useCreatePost';
import { useAuth } from '../context/AuthContext';

interface CreatePostFormProps {
  closeModal: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ closeModal }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const { brandId } = useAuth();
  const { createPost, loading, error } = useCreatePost();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images && brandId) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('brandId', brandId); // Utiliza el ID de la marca desde el contexto
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      const response = await createPost(formData);
      if (response) {
        setSuccessMessage('Publicación creada correctamente. Redirigiendo...');
        setTimeout(() => {
          closeModal();
          navigate(`/brand/${brandId}/posts`);
        }, 2000); // Espera 2 segundos antes de cerrar el modal y redirigir
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Crear Publicación</h2>
        {successMessage && (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
            {successMessage}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Título</label>
            <input
              type="text"
              name="title"
              id="title"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Título de la publicación"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contenido</label>
            <textarea
              name="content"
              id="content"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Contenido de la publicación"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Imágenes</label>
            <input
              type="file"
              name="images"
              id="images"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              multiple
              onChange={handleImagesChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Publicación'}
          </button>
          {error && <p className="text-sm font-light text-red-500 dark:text-red-400">{error}</p>}
        </form>
        <button onClick={closeModal} className="mt-4 text-red-600">Cerrar</button>
      </div>
    </div>
  );
};

export default CreatePostForm;
