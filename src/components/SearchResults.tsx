import React from 'react';
import { useLocation } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import { FaHeart } from 'react-icons/fa';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query') || '';

  const { users, brands, products, loading, error } = useSearch(query);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex justify-center p-4 bg-gray-100">
      <div className="max-w-4xl w-full">
        {brands.length > 0 && (
          <div className="mb-8">
            {/* <h2 className="text-2xl font-bold mb-4 text-white">Marcas</h2> */}
            {brands.map(brand => (
              <div key={brand.id} className="flex items-center mb-2">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <p className="text-lg text-white">{brand.name}</p>
              </div>
            ))}
          </div>
        )}

        {users.length > 0 && (
          <div className="mb-8">
            {/* <h2 className="text-2xl font-bold mb-4 text-white">Usuarios</h2> */}
            {users.map(user => (
              <div key={user.id} className="flex items-center mb-2">
                <img
                  src={user.profile_pic}
                  alt={user.username}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <p className="text-lg text-white">{user.username}</p>
              </div>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div>
            {/* <h2 className="text-2xl font-bold mb-4 text-black">Productos</h2> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white text-black p-4 rounded-lg relative">
                  {Array.isArray(product.image_urls) && product.image_urls.length > 0 && (
                    <img
                      src={product.image_urls[0]}
                      alt={product.name}
                      className="w-full h-40 object-contain mb-4"
                    />
                  )}
                  <button className="absolute top-2 right-2 text-white">
                    <FaHeart size={20} />
                  </button>
                  <div className="text-right">
                    <p className="text-lg font-bold">{product.name}</p>
                    <p className="text-gray-400">Stüssy</p>
                    <p className="text-2xl font-bold">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {users.length === 0 && brands.length === 0 && products.length === 0 && (
          <p className="text-white">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
