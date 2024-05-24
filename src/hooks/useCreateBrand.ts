import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useCreateBrand = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBrand = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3001/create-brand', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setLoading(false);
      return response.data.success;
    } catch (err) {
      setLoading(false);
      setError('Error al crear la marca');
      return false;
    }
  };

  return { createBrand, loading, error };
};

export default useCreateBrand;
