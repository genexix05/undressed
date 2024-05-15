import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [date, setDate] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, surname, date, username, email, password })
            });
            if (!response.ok) {
                throw new Error('Error en el registro');
            }
            const data = await response.json();
            console.log('Registro exitoso:', data);
            navigate('/login'); // Cambiado de history.push a navigate
        } catch (error) {
            console.error('Error al registrar:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
                <h3 className="text-2xl font-bold text-center">Registrarse</h3>
                <form onSubmit={handleRegister}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="name">Nombre</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 mt-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block" htmlFor="surname">Apellido</label>
                            <input type="text" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} className="w-full px-4 py-2 mt-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block" htmlFor="date">Fecha de Nacimiento</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 mt-2 border rounded-md" required />
                        </div>
                        {/* Campos existentes para username, email y password aquí */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
