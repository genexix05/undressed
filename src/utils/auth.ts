import { jwtDecode } from "jwt-decode";
import { decodeJwt } from 'jose';

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem('refreshToken', token);
};

export const removeTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

export const logout = () => {
  removeTokens();
  window.location.href = '/login';
};

interface DecodedToken {
  userId: number;
  email: string;
  role: string;
  exp: number;
}

// export const decodeToken = (token: string): DecodedToken | null => {
//   try {
//     const decodedToken = jwtDecode(token);
//     console.log('Decoded token:', decodedToken);
//     return decodedToken as DecodedToken;
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return null;
//   }
// };

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = decodeJwt(token) as DecodedToken;
    console.log('Decoded tokennnnnnnn:', decoded);  // Agregar log para ver el token decodificado
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const authHeader = (): { Authorization: string } | {} => {
  const token = getAccessToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};
