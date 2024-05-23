// App.tsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ControlPanel from "./components/ControlPanel";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import RegisterBrandPage from "./pages/RegisterBrandPage";
import AccountPage from "./pages/AccountPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import EmailVerifiedPage from "./pages/VerifyEmailCallbackPage";
import DeleteAccount from "./components/DeleteAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import BrandPage from "./pages/BrandPage";
import Header from "./components/Header";

const App: React.FC = () => {
  const location = useLocation();
  const hostname = window.location.hostname;

  return (
    <AuthProvider>
      {location.pathname !== "/register" &&
        location.pathname !== "/verify-email" &&
        location.pathname !== "/verify" && <Header />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-brand" element={<RegisterBrandPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify" element={<EmailVerifiedPage />} />
          <Route path="/home" element={<ProtectedRoute />} />
          <Route path="/delete" element={<DeleteAccount />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/create-brand" element={<BrandPage />} />
          <Route element={<ProtectedRoute role="brand" />}>
            <Route path="/control-panel/*" element={<ControlPanel />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;

/* <ScrapyStarter />
import ScrapyStarter from './components/scrapystarter'; */
