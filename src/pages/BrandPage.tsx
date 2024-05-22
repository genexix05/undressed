import React from 'react';
import CreateBrandForm from '../components/CreateBrandForm';

const BrandPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Marca</h1>
      <CreateBrandForm />
    </div>
  );
};

export default BrandPage;
