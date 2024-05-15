import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { auth, refreshToken } = useAuth();

  useEffect(() => {
    if (!auth.accessToken) {
      refreshToken();
    }
  }, [auth, refreshToken]);

  return (
    <div>
      <h1>Bienvenido a la Página de Inicio</h1>
      {auth.accessToken ? <p>Estás autenticado</p> : <p>No estás autenticado</p>}
    </div>
  );
};

export default HomePage;
