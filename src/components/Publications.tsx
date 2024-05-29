import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';  // Importa el contexto de autenticación

interface Post {
  id: number;
  title: string;
  content: string;
  likes: number;
  images: string[]; // Asegúrate de que la interfaz incluye imágenes
}

const Publications: React.FC = () => {
  const { accessToken } = useAuth();  // Obtén el token de autenticación
  const [posts, setPosts] = useState<Post[]>([]);  // Inicializa posts como un array vacío
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/posts', {
          headers: { Authorization: `Bearer ${accessToken}` }  // Incluye el token de autenticación
        });

        console.log('API response:', response.data);  // Verifica la estructura de la respuesta

        if (response.data && Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
        } else {
          console.error('API response does not contain posts array', response.data);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [accessToken]);

  const openModal = (post: Post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCurrentImageIndex(0);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPost(null);
    setNewImages([]);
    setSuccessMessage('');
    setError('');
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : totalImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < totalImages.length - 1 ? prevIndex + 1 : 0));
  };

  const handleDeleteImage = (index: number) => {
    if (selectedPost) {
      const updatedImages = selectedPost.images.filter((_, i) => i !== index);
      setSelectedPost({ ...selectedPost, images: updatedImages });
      if (currentImageIndex >= updatedImages.length) {
        setCurrentImageIndex(updatedImages.length - 1);
      }
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.put(`http://localhost:3001/api/posts/${selectedPost.id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedPost = { ...selectedPost, title, content };
      if (response.data.updatedImages) {
        updatedPost.images = response.data.updatedImages;
      }

      setPosts(posts.map(post => post.id === selectedPost.id ? updatedPost : post));
      setSuccessMessage('Publicación actualizada con éxito.');
      setLoading(false);
      closeModal();
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Error al actualizar la publicación.');
      setLoading(false);
    }
  };

  // Asegurémonos de que las URLs de las imágenes sean completas
  const totalImages = selectedPost
    ? [
        ...selectedPost.images.map(image =>
          image.startsWith('http://localhost:3001') ? image : `http://localhost:3001${image}`
        ),
        ...newImages.map(file => URL.createObjectURL(file))
      ]
    : [];

  const customStyles = {
    content: {
      inset: '0',
      backgroundColor: 'transparent',
      border: 'none',
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Publications</h1>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pr-10 pl-10">
        {posts.map(post => (
          <div key={post.id} className="relative cursor-pointer" onClick={() => openModal(post)}>
            <div className="relative w-full h-64 overflow-hidden">
              <img src={post.images[0].startsWith('http://localhost:3001') ? post.images[0] : `http://localhost:3001${post.images[0]}`} alt={`Post ${post.id}`} className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <p className="text-white text-xl font-semibold">{post.title}</p>
              </div>
              <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 rounded-full px-3 py-1 text-white text-sm">
                Likes: {post.likes}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedPost && (
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Post Modal" style={customStyles}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl h-2/4 flex relative">
              <div className="flex-1 bg-gray-300 relative">
                {totalImages.length > 0 ? (
                  <>
                    <div className="relative w-full h-full">
                      <img src={totalImages[currentImageIndex]} alt={`preview ${currentImageIndex}`} className="w-full h-full object-contain"/>
                      <button onClick={() => handleDeleteImage(currentImageIndex)} className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 rounded-full p-2">
                        &times;
                      </button>
                      {totalImages.length > 1 && (
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
                {totalImages.length < 4 && (
                  <label htmlFor="images" className="absolute bottom-4 right-4 text-white cursor-pointer bg-black bg-opacity-50 p-2 rounded-full">
                    <svg aria-hidden="true" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <input id="images" type="file" className="hidden" multiple onChange={handleImagesChange} />
                  </label>
                )}
              </div>
              <div className="flex-1 p-6 bg-gray-100 relative">
                <button onClick={closeModal} className="absolute top-2 right-2 text-gray-900 text-2xl font-bold">&times;</button>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="bg-gray-100 border-none outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-gray-500 focus:ring-opacity-50 block w-full p-2.5"
                      placeholder="Título"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      name="content"
                      id="content"
                      className="bg-gray-100 border-none outline-none text-gray-900 sm:text-sm rounded-lg block w-full h-32 p-2.5 resize-none focus:ring-gray-500 focus:ring-opacity-50"
                      placeholder="Contenido"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <button
                    type="submit"
                    className="w-full text-white bg-gray-900 focus:ring-4 focus:ring-opacity-50 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  {error && <p className="text-sm font-light text-red-500">{error}</p>}
                  {successMessage && (
                    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                      {successMessage}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Publications;
