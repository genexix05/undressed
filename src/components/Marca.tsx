import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface MarcaProps {
  id: number;
  descripcion: string;
  logoUrl: string;
}

const Marca: React.FC = () => {
  const { brandId, accessToken } = useAuth();
  const [marca, setMarca] = useState<MarcaProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarca = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/marca/${brandId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMarca(response.data);
    } catch (err) {
      setError('Error fetching marca data');
    } finally {
      setLoading(false);
    }
  }, [accessToken, brandId]);

  useEffect(() => {
    if (brandId) {
      fetchMarca();
    }
  }, [fetchMarca, brandId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMarca((prevMarca) => (prevMarca ? { ...prevMarca, [name]: value } : null));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const logoUrl = URL.createObjectURL(e.target.files[0]);
      setMarca((prevMarca) => (prevMarca ? { ...prevMarca, logoUrl } : null));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (marca) {
      try {
        await axios.put(`http://localhost:3001/api/marca/${marca.id}`, marca, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        alert('Marca actualizada con éxito');
      } catch (err) {
        setError('Error updating marca data');
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Editar Marca</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={marca?.descripcion || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Logo
          </label>
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>
        {marca?.logoUrl && (
          <div className="mb-4">
            <img src={marca.logoUrl} alt="Logo de la marca" className="h-32 w-32 object-cover" />
          </div>
        )}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default Marca;
