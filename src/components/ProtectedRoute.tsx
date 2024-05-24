import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (role && userRole !== role) {
    return <Navigate to="/home" />;

  }

  return <Outlet />;
};

export default ProtectedRoute;
