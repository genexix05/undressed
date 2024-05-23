import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCreateBrand from '../hooks/useCreateBrand';

const CreateBrandForm: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [brandDescription, setBrandDescription] = useState('');
  const { createBrand, loading, error } = useCreateBrand();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBrandLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (brandLogo) {
      const formData = new FormData();
      formData.append('name', brandName);
      formData.append('logo', brandLogo);
      formData.append('description', brandDescription);

      const success = await createBrand(formData);
      if (success) {
        setSuccessMessage('Marca creada correctamente. Redirigiendo al panel de control...');
        setTimeout(() => {
          navigate('/control-panel');
        }, 2000); // Espera 2 segundos antes de redirigir
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          Flowbite
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Crear una marca
            </h1>
            {successMessage && (
              <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800">
                {successMessage}
              </div>
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="brandName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre de la marca</label>
                <input
                  type="text"
                  name="brandName"
                  id="brandName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Nombre de la marca"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="brandLogo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Logo de la marca</label>
                <input
                  type="file"
                  name="brandLogo"
                  id="brandLogo"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleLogoChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="brandDescription" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción de la marca</label>
                <textarea
                  name="brandDescription"
                  id="brandDescription"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Describe brevemente la marca"
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Marca'}
              </button>
              {error && <p className="text-sm font-light text-red-500 dark:text-red-400">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateBrandForm;
