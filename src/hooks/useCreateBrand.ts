import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

const useCreateBrand = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBrand = async (name: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/create-brand', { name }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setError(null);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Error al crear la marca.');
      } else {
        setError('Error desconocido al crear la marca.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBrand, loading, error };
};

export default useCreateBrand;
