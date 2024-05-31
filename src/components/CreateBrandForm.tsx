import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCreateBrand from '../hooks/useCreateBrand';
import { getCroppedImg } from '../utils/cropImage';

const CreateBrandForm: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState<string | null>(null);
  const [brandDescription, setBrandDescription] = useState('');
  const { createBrand, loading, error } = useCreateBrand();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBrandLogo(file);
      setBrandLogoPreview(URL.createObjectURL(file));
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: { x: number, y: number, width: number, height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!brandLogo || !croppedAreaPixels) {
      alert('Por favor, suba y recorte el logo de la marca.');
      return;
    }

    const croppedImage = await getCroppedImg(brandLogoPreview!, croppedAreaPixels);
    const formData = new FormData();
    formData.append('name', brandName);
    formData.append('logo', croppedImage as Blob);
    formData.append('description', brandDescription);

    const success = await createBrand(formData);
    if (success) {
      setSuccessMessage('Marca creada correctamente.');
      toast.success('Marca creada con éxito.');
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 2000);
    }
  };

  return (
    <section className="flex items-center justify-center mt-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Crear una Marca</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="brandName" className="block mb-2 text-sm font-medium text-gray-700">Nombre de la marca</label>
            <input
              type="text"
              name="brandName"
              id="brandName"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Nombre de la marca"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="brandLogo" className="block mb-2 text-sm font-medium text-gray-700">Logo de la marca</label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="brandLogo"
                className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
              >
                {brandLogoPreview ? (
                  <div className="relative w-32 h-32">
                    <Cropper
                      image={brandLogoPreview}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-gray-400 text-3xl">+</span>
                    <span className="text-gray-400 text-sm">Subir Logo</span>
                  </div>
                )}
                <input
                  type="file"
                  name="brandLogo"
                  id="brandLogo"
                  className="hidden"
                  onChange={handleLogoChange}
                  required
                />
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="brandDescription" className="block mb-2 text-sm font-medium text-gray-700">Descripción de la marca</label>
            <textarea
              name="brandDescription"
              id="brandDescription"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Describe brevemente la marca"
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-purple-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Marca'}
          </button>
          {error && <p className="text-sm font-light text-red-500">{error}</p>}
        </form>
        <ToastContainer />
      </div>
    </section>
  );
};

export default CreateBrandForm;
