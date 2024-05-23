import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

const useCreatePost = () => {
  const { accessToken } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPost = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3001/api/create-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError('Error al crear la publicación');
      return null;
    }
  };

  return { createPost, loading, error };
};

export default useCreatePost;
