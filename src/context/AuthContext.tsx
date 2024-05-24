import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, removeTokens, decodeToken } from "../utils/auth";

export interface PostType {
  id: number;
  title: string;
  content: string;
  brandName: string;
  brandLogo: string;
  images: string[];
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  accessToken: string | null;
  isInBrand: boolean;
  brandId: string | null;
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
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
  const [isInBrand, setIsInBrand] = useState<boolean>(false);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setIsAuthenticated(true);
        setUserRole(String(decodedToken.role));
        setAccessTokenState(token);
        checkIsInBrand(token);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setAccessTokenState(null);
        console.log("Token could not be decoded");
      }
    }
  }, []);

  const checkIsInBrand = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3001/api/check-in-brand', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsInBrand(response.data.isInBrand);
      if (response.data.isInBrand) {
        // Fetch brand ID if the user is in a brand
        fetchBrandId(token);
      }
    } catch (error) {
      console.error('Error checking brand status:', error);
      setIsInBrand(false);
      setBrandId(null);
    }
  };

  const fetchBrandId = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3001/api/get-brand-id', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBrandId(response.data.brandId);
      console.log("Brand ID:", response.data.brandId);
    } catch (error) {
      console.error('Error retrieving brand ID:', error);
      setBrandId(null);
    }
  };

  const login = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    const decodedToken = decodeToken(accessToken);
    if (decodedToken) {
      setIsAuthenticated(true);
      setUserRole(String(decodedToken.role));
      setAccessTokenState(accessToken);
      console.log("Role decoded from token on login:", decodedToken.role);

      // Check if the user is in a brand after login
      checkIsInBrand(accessToken);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setAccessTokenState(null);
      setBrandId(null);
    }
  };

  const logout = () => {
    removeTokens();
    setIsAuthenticated(false);
    setUserRole(null);
    setAccessTokenState(null);
    setIsInBrand(false);
    setBrandId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, accessToken, isInBrand, brandId, setPosts, posts, login, logout }}>
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
