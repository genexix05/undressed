import React from 'react';

interface BrandInfoProps {
  brandData: {
    name: string;
    description: string;
    logo: string;
  };
}

const BrandInfo: React.FC<BrandInfoProps> = ({ brandData }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-2">Información de la Marca</h3>
      <img src={`http://localhost:3001/uploads/${brandData.logo}`} alt={brandData.name} className="w-20 h-20 mb-4" />
      <p className="text-lg font-semibold">{brandData.name}</p>
      <p className="text-gray-600">{brandData.description}</p>
    </div>
  );
};

export default BrandInfo;
