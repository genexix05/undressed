import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterBrandPage: React.FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/register-brand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          surname,
          date,
          username,
          email,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error("Error en el registro");
      }
      const data = await response.json();
      console.log("Registro exitoso:", data);
      navigate("/verify-email");
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-bold text-center">Registrar Marca</h3>
        <form onSubmit={handleRegister}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="name">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block" htmlFor="surname">
                Apellido
              </label>
              <input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block" htmlFor="date">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block" htmlFor="username">
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block" htmlFor="password">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block" htmlFor="confirmPassword">
                Repetir Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                required
              />
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 rounded-md"
              >
                Registrar
              </button>
              <Link to="/login" className="text-blue-600 hover:underline">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBrandPage;
