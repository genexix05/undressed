import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const { isAuthenticated, userRole } = useAuthContext();

  if (role && userRole !== role) {
    return <Navigate to="/home" />;

  }

  return <Outlet />;
};

export default ProtectedRoute;
