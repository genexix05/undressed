// App.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  const location = useLocation(); // Hook para obtener la ubicación actual

  return (
    <>
      {/* Renderiza el Header solo si no estamos en la página de registro */}
      {location.pathname !== '/register' && <Header />}
      <Routes>
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/register" element={<RegisterPage />} />
        {/* Añade más rutas según sea necesario */}
      </Routes>
    </>
  );
};

export default App;


/* <ScrapyStarter />
import ScrapyStarter from './components/scrapystarter'; */