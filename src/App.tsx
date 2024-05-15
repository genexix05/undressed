// App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import EmailVerifiedPage from './pages/VerifyEmailCallbackPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const location = useLocation(); // Hook para obtener la ubicación actual

  return (
    <>
      {/* Renderiza el Header solo si no estamos en la página de registro, login o verifiaciones */}
      {location.pathname !== '/register' && location.pathname !== '/verify' && location.pathname !== '/email-verified' && <Header />}
      <Routes>
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/email-verified" element={<EmailVerifiedPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
        {/* Añade más rutas según sea necesario */}
      </Routes>
    </>
  );
};

export default App;


/* <ScrapyStarter />
import ScrapyStarter from './components/scrapystarter'; */