import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      login(data.accessToken, data.refreshToken); // Almacena tanto el accessToken como el refreshToken
      navigate('/home');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className=" mt-16 flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">¿Ya eres socio de Undressed?</h2>
        <div className="flex justify-center items-center mb-6">
          <span className="block border-t w-full"></span>
          <span className="block border-t w-full"></span>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-600" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-600" htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <a href="#" className="text-sm text-blue-600 hover:underline">He olvidado mi contraseña</a>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2"
        >
          Conectarme
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
