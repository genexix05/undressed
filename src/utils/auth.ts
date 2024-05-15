export const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
  };
  
  export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
  };
  
  export const setAccessToken = (token: string): void => {
    localStorage.setItem('accessToken', token);
  };
  
  export const setRefreshToken = (token: string): void => {
    localStorage.setItem('refreshToken', token);
  };
  
  export const removeTokens = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };
  
  export const isAuthenticated = (): boolean => {
    return getAccessToken() !== null;
  };
  
  export const authHeader = (): { Authorization: string } | {} => {
    const token = getAccessToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  };
  