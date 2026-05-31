import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axiosInstance'; // Axios instance with JWT header support

// Create a context to hold auth-related data
const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  // Load token from localStorage on initialization
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Load user from localStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Extract wallet address from the user object
  const walletAddress = user?.walletAddress || null;

  // Automatically fetch user details if token exists and user is not yet loaded
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/me'); // Authenticated route
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        logout(); // Invalid token or fetch failure – cleanup
      }
    };

    if (token && !user) {
      fetchUser();
    }
  }, [token]);

  // Login: set token and user data in state and localStorage
  const login = (userData, jwt) => {
    setToken(jwt);
    setUser(userData);
    localStorage.setItem("token", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout: notify backend, then clear state and storage
  const logout = async () => {
    try {
      await axios.post('/auth/logout'); // Hit logout API to blacklist token
    } catch (err) {
      console.warn('Logout failed:', err.message);
    }
    setToken(null);
    setUser(null);
    localStorage.clear(); // Remove all stored items
  };

  // Boolean indicating if current user has admin privileges
  const isAdmin = user?.role === "admin";

  // Provide values to all components wrapped by AuthProvider
  return (
    <AuthContext.Provider 
      value={{ token, walletAddress, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext from components
export const useAuth = () => useContext(AuthContext);
