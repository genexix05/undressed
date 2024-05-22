import React, { useState } from 'react';
import useCreateBrand from '../hooks/useCreateBrand';

const CreateBrandForm = () => {
  const { createBrand, loading, error } = useCreateBrand();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createBrand(name);
      console.log('Marca creada:', result);
      setName('');
    } catch (error) {
      console.error('Error al crear la marca:', error);
    }
  };

  return (
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
  );
};

export default CreateBrandForm;
