import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUserCircle,
  FaSearch,
  FaPlusCircle,
  FaSignInAlt,
  FaCogs,
  FaUserShield,
} from "react-icons/fa";
import "../fonts.css";

const Header: React.FC = () => {
  const { isAuthenticated, userRole, isInBrand } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const getLogo = () => {
    if (userRole === "brand") {
      return "/assets/images/undn.png";
    }
    return "/assets/images/und.png";
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 flex flex-wrap md:justify-start md:flex-nowrap w-full py-7">
      <nav
        className="relative max-w-7xl w-full flex flex-wrap md:grid md:grid-cols-12 basis-full items-center px-4 md:px-6 md:px-8 mx-auto"
        aria-label="Global"
      >
        <div className="md:col-span-3">
          <a
            className="flex items-center space-x-2 rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
            href="/home"
            aria-label="Preline"
          >
            <img src={getLogo()} alt="Undressed" className="h-10" />
          </a>
        </div>
        <div className="flex items-center gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-gradient-to-tr from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition focus:outline-none focus:from-purple-600 focus:to-pink-600"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              {userRole === "brand" && isInBrand ? (
                <>
                  <Link
                    to="/control-panel/dashboard"
                    className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-purple-500 text-black hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 hover:text-white transition focus:outline-none whitespace-nowrap"
                  >
                    <FaCogs className="text-lg" />
                    <span>Panel de Control</span>
                  </Link>
                </>
              ) : userRole === "brand" && !isInBrand ? (
                <>
                  <Link
                    to="/create-brand"
                    className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-purple-500 text-black hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 hover:text-white transition focus:outline-none whitespace-nowrap"
                  >
                    <FaPlusCircle className="text-lg" />
                    <span>Crear Marca</span>
                  </Link>
                </>
              ) : userRole === "admin" ? (
                <Link
                  to="/admin-panel"
                  className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-purple-500 text-black hover:bg-gradient-to-tr hover:from-purple-500 hover:to-pink-500 hover:text-white transition focus:outline-none whitespace-nowrap"
                >
                  <FaUserShield className="text-lg" />
                  <span>Admin</span>
                </Link>
              ) : null}
              <Link
                to="/account"
                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-gradient-to-tr from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition focus:outline-none focus:from-purple-600 focus:to-pink-600 whitespace-nowrap"
              >
                <FaUserCircle className="text-lg" />
                <span>Mi cuenta</span>
              </Link>
            </>
          )}
          <div className="md:hidden">{/* Botón de menú móvil aquí */}</div>
        </div>
        <div
          id="navbar-collapse-with-animation"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block md:w-auto md:basis-auto md:order-2 md:col-span-6"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 md:flex-row md:justify-center md:items-center md:gap-y-0 md:gap-x-7 md:mt-0">
            <div className="relative w-full md:w-1/2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                <input
                  type="text"
                  placeholder="Buscar productos/usuarios/marcas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:border-gray-400 placeholder-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
