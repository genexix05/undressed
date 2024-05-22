// App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import RegisterBrandPage from './pages/RegisterBrandPage';
import AccountPage from './pages/AccountPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import EmailVerifiedPage from './pages/VerifyEmailCallbackPage';
import DeleteAccount from './components/DeleteAccount';
import ProtectedRoute from './components/ProtectedRoute';


const App: React.FC = () => {
  const location = useLocation();
  const hostname = window.location.hostname;

  return (
    <AuthProvider>
      {/* Renderiza el Header solo si no estamos en la página de registro, login o verifiaciones */}
      {location.pathname !== '/register' && location.pathname !== '/verify-email' && location.pathname !== '/verify'  && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* {hostname.includes('business') ? (
            <Route path="/register" element={<RegisterBrandPage />} />
          ) : (
            <Route path="/register" element={<RegisterPage />} />
          )} */}
        <Route path="/register-brand" element={<RegisterBrandPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify" element={<EmailVerifiedPage />} />
        <Route path="/home" element={<ProtectedRoute />} />
        <Route path="/delete" element={<DeleteAccount />} />
        <Route path="/account" element={<AccountPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
        {/* Añade más rutas según sea necesario */}
      </Routes>
    </AuthProvider>
  );
};

export default App;


/* <ScrapyStarter />
import ScrapyStarter from './components/scrapystarter'; */