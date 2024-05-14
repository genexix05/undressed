import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de que react-router-dom está instalado

const NavBar: React.FC = () => {
    return (
        <nav className="bg-purple-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                {/* Nombre de la aplicación a la izquierda */}
                <Link to="/" className="text-xl font-bold">
                    UNDRESSED
                </Link>

                {/* Barra de búsqueda en el centro */}
                <div className="flex-grow mx-4">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full p-2 text-gray-700 rounded"
                    />
                </div>

                {/* Icono de cuenta a la derecha */}
                <Link to="/profile" className="flex items-center justify-center p-2 rounded hover:bg-purple-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M12 12a4 4 0 100-8 4 4 0 000 8zm0 12a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
