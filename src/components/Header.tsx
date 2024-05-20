import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import "../fonts.css";

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Obtener el usuario actual del contexto de autenticación

  return (
    <>
      {/* ========== HEADER ========== */}
      <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full py-7 border-b border-gray-200">
        <nav
          className="relative max-w-7xl w-full flex flex-wrap md:grid md:grid-cols-12 basis-full items-center px-4 md:px-6 md:px-8 mx-auto"
          aria-label="Global"
        >
          <div className="md:col-span-3">
            {/* Logo and text grouped together using Flexbox */}
            <a
              className="flex items-center space-x-2 rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
              href="/home"
              aria-label="Preline"
            >
              <img
                src="../public/assets/images/und.png"
                alt="Undressed"
                className="h-10"
              />{" "}
              {/* Reemplaza con la ruta a tu imagen */}
            </a>
          </div>
          {/* Button Group */}
          <div className="flex items-center gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login" // Ajusta el path según tus rutas
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 text-black hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register" // Ajusta el path según tus rutas
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-gradient-to-tr from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition focus:outline-none focus:from-purple-600 focus:to-pink-600"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <Link
                to="/account" // Ajusta el path según tus rutas
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-transparent bg-gradient-to-tr from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition focus:outline-none focus:from-purple-600 focus:to-pink-600"
              >
                <FaUserCircle className="text-xl" /> {/* Icono de cuenta */}
                Mi cuenta
              </Link>
            )}
            <div className="md:hidden">{/* Botón de menú móvil aquí */}</div>
          </div>
          {/* End Button Group */}
          {/* Collapse */}
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
                    placeholder="Search.."
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End Collapse */}
        </nav>
      </header>
      {/* ========== END HEADER ========== */}
    </>
  );
};

export default Header;
