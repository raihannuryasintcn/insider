import { Navigate, Outlet } from 'react-router-dom';
import React, { createContext, useState, useContext, useEffect } from 'react';
import Loading from '../components/custom/Loading';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token and user in both localStorage and sessionStorage
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const expirationTime = localStorage.getItem('expirationTime');

    if (storedToken && storedUser) {
      // If there's an expiration time, check if it's still valid
      if (expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime < parseInt(expirationTime, 10)) {
          setToken(storedToken);
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && typeof parsedUser === 'object' && parsedUser.role) {
              setUser(parsedUser);
            } else {
              // If user object is invalid, clear storage to prevent issues
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('expirationTime');
            }
          } catch (e) {
            console.error("Failed to parse stored user from localStorage:", e);
            // Clear storage if parsing fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('expirationTime');
          }
        } else {
          // Token has expired, clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('expirationTime');
        }
      } else {
        // No expiration time means it's a session-only login
        setToken(storedToken);
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && typeof parsedUser === 'object' && parsedUser.role) {
            setUser(parsedUser);
          } else {
            // If user object is invalid, clear storage to prevent issues
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
          }
        } catch (e) {
          console.error("Failed to parse stored user from sessionStorage:", e);
          // Clear storage if parsing fails
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken, newUser, keepLoggedIn) => {
    setToken(newToken);
    setUser(newUser);

    if (keepLoggedIn) {
      // Store in localStorage for persistent login
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
      localStorage.setItem('expirationTime', expirationTime.toString());

      // Clear sessionStorage if it exists
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } else {
      // Store in sessionStorage for session-only login
      sessionStorage.setItem('token', newToken);
      sessionStorage.setItem('user', JSON.stringify(newUser));

      // Clear localStorage if it exists
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('expirationTime');
    }
  };

  const logout = () => {
    // Clear both localStorage and sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expirationTime');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

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

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <Loading /> // Or your loading component
  }

  if (!user) {
    // User is not authenticated, redirect to sign-in page
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

export const AdminProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'administrator') {
    // User is authenticated but not an administrator, redirect to home or a forbidden page
    return <Navigate to="/" replace />; // Redirect to home page
  }

  return <Outlet />;
};

export default ProtectedRoute;