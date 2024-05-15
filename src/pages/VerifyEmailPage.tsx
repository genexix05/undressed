import React from 'react';

const VerifyEmailPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-bold text-center">Verifica tu Correo</h3>
        <p className="text-center mt-4">Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.</p>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
