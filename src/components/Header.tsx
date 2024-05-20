import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import '../fonts.css';

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
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width={50}
                height={50}
                viewBox="0 0 800 800"
              >
                <defs>
                  <style
                    dangerouslySetInnerHTML={{
                      __html:
                        ".cls-1, .cls-2 { fill: #2e2e2e; } .cls-1 { stroke: #000; stroke-width: 1px; } .cls-2 { fill-rule: evenodd; filter: url(#filter); }",
                    }}
                  />
                  <filter
                    id="filter"
                    x="41.125"
                    y="298.75"
                    width="717.75"
                    height="181.531"
                    filterUnits="userSpaceOnUse"
                  >
                    <feImage
                      preserveAspectRatio="none"
                      x="41.125"
                      y="298.75"
                      width="717.75"
                      height="181.531"
                      result="image"
                      xlinkHref="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNzE3Ljc1IiBoZWlnaHQ9IjE4MS41MzEiIHZpZXdCb3g9IjAgMCA3MTcuNzUgMTgxLjUzMSI+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5jbHMtMSB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQpOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHkxPSI5MC43NjUiIHgyPSI3MTcuNzUiIHkyPSI5MC43NjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSItMC4yNSIgc3RvcC1jb2xvcj0iIzZlNThkNyIgc3RvcC1vcGFjaXR5PSIwLjk5NiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEuMjUiIHN0b3AtY29sb3I9IiNjZDRjOGYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IGNsYXNzPSJjbHMtMSIgd2lkdGg9IjcxNy43NSIgaGVpZ2h0PSIxODEuNTMxIi8+Cjwvc3ZnPgo="
                    />
                    <feComposite
                      result="composite"
                      operator="in"
                      in2="SourceGraphic"
                    />
                    <feBlend result="blend" in2="SourceGraphic" />
                  </filter>
                </defs>
                <rect
                  id="Rectángulo_1"
                  data-name="Rectángulo 1"
                  className="cls-1"
                  width={800}
                  height={800}
                  rx={25}
                  ry={25}
                />
                <path
                  id="UND"
                  className="cls-2"
                  d="M196.689,389.575c0.356,29.136-21.239,34.146-46.63,34.541-25.511-.395-46.987-5.4-46.749-34.541V298.74H41.136v95.186C40.9,460.9,90.258,480.147,150.059,480.279c59.8-.132,109.16-19.38,108.922-86.353V298.74H196.689v90.835Zm245.848,3.033-70-93.868H286.983V475.928h62.174V367.691l85.667,108.237h70.005V298.74H442.537v93.868Zm254.034-5.01c0,17.8-9.136,32.432-25.273,32.432H603.192V355.166H671.3C687.435,355.166,696.571,369.668,696.571,387.6ZM541.018,299V476.192H682.926c43.783,0.659,76.294-40.474,75.938-88.594,0.356-48.384-32.155-89.253-75.938-88.594H541.018Z"
                />
              </svg> */}
              <p className="font-custom font bg-gradient-to-tr from-purple-500 to-pink-500 text-transparent text-xl bg-clip-text ">
                Undressed
              </p>
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
