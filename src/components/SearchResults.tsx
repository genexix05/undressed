import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import { FaHeart, FaCheck } from 'react-icons/fa';

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
            {brands.map(brand => (
              <div key={brand.id} className="bg-white text-black p-4 rounded-lg flex items-center mb-4 shadow-md w-full">
                <div className="flex items-center justify-end text-lg font-bold flex-1 mr-4">
                  <FaCheck className="text-yellow-500 mr-2" />
                  <span className="text-right">{brand.name}</span>
                </div>
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
            ))}
          </div>
        )}

        {users.length > 0 && (
          <div className="mb-8">
            {users.map(user => (
              <div key={user.id} className="bg-white text-black p-4 rounded-lg flex items-center mb-4 shadow-md w-full">
                <p className="text-lg font-bold text-right flex-1 mr-4">{user.username}</p>
                <img
                  src={user.profile_pic}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
              </div>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="bg-white text-black p-4 rounded-lg relative shadow-md">
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
                    <p className="text-2xl font-bold">{product.price} €</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {users.length === 0 && brands.length === 0 && products.length === 0 && (
          <p className="text-black">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
