import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCreateBrand from '../hooks/useCreateBrand';

const CreateBrandForm = () => {
  const navigate = useNavigate();
  const { createBrand, loading, error } = useCreateBrand();
  const [name, setName] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createBrand(name);
      console.log('Marca creada:', result);
      setName('');
      setPopupVisible(true);
    } catch (error) {
      console.error('Error al crear la marca:', error);
    }
  };

  const handlePopupClick = () => {
    setPopupVisible(false);
    navigate('/home');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 border rounded-md">
        <div>
          <label>Nombre de la Marca:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-md"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded-md">
          {loading ? 'Creando...' : 'Crear Marca'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md text-center">
            <p>Marca creada correctamente. Haz clic aquí para ir a editarla.</p>
            <button onClick={handlePopupClick} className="bg-blue-500 text-white p-2 rounded-md mt-2">
              Ir a Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBrandForm;
