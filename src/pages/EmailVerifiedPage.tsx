import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerifiedPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Establecer un temporizador para redirigir al usuario
    const timer = setTimeout(() => {
      navigate('/'); // Asegúrate de que '/home' es la ruta correcta para tu página de inicio
    }, 5000); // 5000 ms = 5 segundos

    // Limpiar el temporizador si el componente se desmonta antes de que se agote el tiempo
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h2>Correo verificado</h2>
      <p>Tu correo ha sido verificado con éxito.</p>
    </div>
  );
}

export default EmailVerifiedPage;
