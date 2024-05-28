import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useCreatePost from '../hooks/useCreatePost';

interface CreatePostFormProps {
  closeModal: () => void;
}

interface BrandInfo {
  id: string;
  name: string;
  logo: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ closeModal }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { brandId, accessToken } = useAuth();
  const { createPost, loading, error } = useCreatePost();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);

  useEffect(() => {
    const fetchBrandInfo = async () => {
      if (!brandId) {
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/brandinfo/${brandId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setBrandInfo(response.data);
      } catch (err) {
        console.error('Error fetching brand info:', err);
      }
    };

    if (brandId && accessToken) {
      fetchBrandInfo();
    }
  }, [brandId, accessToken]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length + images.length <= 4) {
        setImages(prevImages => [...prevImages, ...filesArray]);
        setCurrentImageIndex(images.length); // Mostrar la última imagen subida
      } else {
        alert('Puedes subir hasta 4 imágenes.');
      }
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(prevImages => {
      const newImages = prevImages.filter((_, i) => i !== index);
      if (currentImageIndex >= newImages.length) {
        setCurrentImageIndex(newImages.length - 1);
      }
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length > 0 && brandId) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('brandId', brandId);
      images.forEach(image => formData.append('images', image));

      const response = await createPost(formData);
      if (response) {
        setSuccessMessage('Publicación creada correctamente. Redirigiendo...');
        setTimeout(() => {
          closeModal();
          navigate(`/brand/${brandId}/posts`);
        }, 2000);
      }
    } else {
      console.error('Brand ID is missing or no images selected');
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!brandInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl flex">
        <div className="flex-1 bg-black relative">
          {images.length > 0 ? (
            <>
              <div className="relative w-full h-full">
                <img src={URL.createObjectURL(images[currentImageIndex])} alt={`preview ${currentImageIndex}`} className="w-full h-full object-contain"/>
                <button onClick={() => handleDeleteImage(currentImageIndex)} className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 rounded-full p-2">
                  &times;
                </button>
                {images.length > 1 && (
                  <>
                    <button onClick={handlePrevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2">{"<"}</button>
                    <button onClick={handleNextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2">{">"}</button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white text-3xl">
              Imágenes
            </div>
          )}
          {images.length < 4 && (
            <label htmlFor="images" className="absolute bottom-4 right-4 text-white cursor-pointer bg-black bg-opacity-50 p-2 rounded-full">
              <svg aria-hidden="true" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              <input id="images" type="file" className="hidden" multiple onChange={handleImagesChange} />
            </label>
          )}
        </div>
        <div className="flex-1 p-6 bg-gray-100">
          <div className="flex items-center mb-4">
            {brandInfo.logo && <img src={`http://localhost:3001/uploads/${brandInfo.logo}`} alt={brandInfo.name} className="h-10 w-10 rounded-full mr-2" />}
            <h2 className="text-xl font-bold text-gray-900">{brandInfo.name}</h2>
          </div>
          {successMessage && (
            <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="title"
                id="title"
                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <hr className="my-4 border-gray-300" />
            <div>
              <textarea
                name="content"
                id="content"
                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                placeholder="Contenido"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Publicación'}
            </button>
            {error && <p className="text-sm font-light text-red-500">{error}</p>}
          </form>
          <button onClick={closeModal} className="mt-4 text-gray-900">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;
