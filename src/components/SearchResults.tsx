import React from "react";
import { useLocation, Link } from "react-router-dom";
import useSearch from "../hooks/useSearch";
import { FaHeart, FaCheck } from "react-icons/fa";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";

  const { users, brands, products, loading, error } = useSearch(query);

  const getUserImageUrl = (url: string | null) => {
    if (!url) return "";
    const fileName = url.split("\\").pop();
    return `http://localhost:3001/uploads/${fileName}`;
  };

  const getBrandImageUrl = (url: string | null) => {
    if (!url) return "";
    const fileName = url.split("\\").pop();
    return `http://localhost:3001/uploads/${fileName}`;
  };

  const getProductImageUrl = (urls: string[]) => {
    for (const url of urls) {
      if (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".gif")) {
        return url;
      }
    }
    return urls[0]; // Fallback to the first URL if no valid image URL is found
  };

  const extractBrandFromUrl = (url: string) => {
    if (!url) return "Unknown Brand";
    const match = url.match(/:\/\/(?:www\.)?(?:[^\.]+\.)?([^\.]+)\.[^\/]+/);
    return match
      ? match[1].charAt(0).toUpperCase() + match[1].slice(1)
      : "Unknown Brand";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex justify-center p-4 bg-gray-100">
      <div className="max-w-4xl w-full">
        <span className="mx-4 text-gray-500">Marcas</span>
        <div className="flex-grow border-t border-gray-300"></div>
        {brands.length > 0 && (
          <div className="mb-8 mt-4">
            {brands.map((brand) => (
              <Link
                to={`/brand/${brand.id}`}
                key={brand.id}
                className="no-underline"
              >
                <div className="bg-white text-black p-4 rounded-lg flex items-center mb-4 shadow-md w-full">
                  <div className="flex items-center justify-end text-lg font-bold flex-1 mr-4">
                    <FaCheck className="text-yellow-500 mr-2" />
                    <span className="text-right">{brand.name}</span>
                  </div>
                  <img
                    src={getBrandImageUrl(brand.logo)}
                    alt={brand.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
        <span className="mx-4 text-gray-500">Usuarios</span>
        <div className="flex-grow border-t border-gray-300"></div>
        {users.length > 0 && (
          <div className="mb-8 mt-4">
            {users.map((user) => (
              <Link
                to={`/user/${user.id}`}
                key={user.id}
                className="no-underline"
              >
                <div className="bg-white text-black p-4 rounded-lg flex items-center mb-4 shadow-md w-full">
                  <p className="text-lg font-bold text-right flex-1 mr-4">
                    {user.username}
                  </p>
                  {user.profile_pic ? (
                    <img
                      src={getUserImageUrl(user.profile_pic)}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <span className="mx-4 text-gray-500">Productos</span>
        <div className="flex-grow border-t border-gray-300"></div>
        {products.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {products.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="bg-white text-black p-4 rounded-lg relative shadow-md"
                >
                  {Array.isArray(product.image_urls) && product.image_urls.length > 0 && (
                    <img
                      src={getProductImageUrl(product.image_urls)}
                      alt={product.name}
                      className="w-full h-40 object-contain mb-4"
                    />
                  )}
                  <button className="absolute top-2 right-2 text-white">
                    <FaHeart size={20} />
                  </button>
                  <div className="text-right">
                    <p className="text-lg font-bold">{product.name}</p>
                    <p className="text-gray-400">
                      {extractBrandFromUrl(product.url)}
                    </p>
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