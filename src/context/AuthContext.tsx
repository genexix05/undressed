import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, removeTokens, decodeToken } from "../utils/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      console.log("Token before decoding:", token);
      const decodedToken = decodeToken(token);
      console.log("Decoded token:", decodedToken);
      if (decodedToken) {
        setIsAuthenticated(true);
        setUserRole(String(decodedToken.role));
        setAccessTokenState(token);
        console.log("Role decoded from token on initial load:", decodedToken.role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setAccessTokenState(null);
        console.log("Token could not be decoded");
      }
    }
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    const decodedToken = decodeToken(accessToken);
    if (decodedToken) {
      setIsAuthenticated(true);
      setUserRole(String(decodedToken.role));
      setAccessTokenState(accessToken);
      console.log("Role decoded from token on login:", decodedToken.role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setAccessTokenState(null);
    }
  };

  const logout = () => {
    removeTokens();
    setIsAuthenticated(false);
    setUserRole(null);
    setAccessTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
