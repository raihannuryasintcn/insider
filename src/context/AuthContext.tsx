import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  user: any; // Replace 'any' with a proper User type if you have one
  token: string | null;
  login: (token: string, user: any, keepLoggedIn?: boolean) => void; // Add keepLoggedIn parameter
  logout: () => void;
  isLoading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state to true

  useEffect(() => {
    // Check for token and user in localStorage on initial load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const expirationTime = localStorage.getItem('expirationTime');

    if (storedToken && storedUser && expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime < parseInt(expirationTime, 10)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Token has expired, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expirationTime');
      }
    }
    setIsLoading(false); // Set loading to false after checking localStorage
  }, []);

  const login = (newToken: string, newUser: any, keepLoggedIn?: boolean) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    if (keepLoggedIn) {
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      localStorage.setItem('expirationTime', expirationTime.toString());
    } else {
      localStorage.removeItem('expirationTime'); // Remove expiration if not keeping logged in
    }

    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expirationTime'); // Also remove expiration time on logout
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};