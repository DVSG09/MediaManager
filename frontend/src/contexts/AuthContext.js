import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Get user info
        await fetchUser();
      } else {
        delete axios.defaults.headers.common['Authorization'];
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:8001/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🚀 Attempting login with:', { email, password: '***' });
      
      const response = await axios.post('http://localhost:8001/api/auth/login', {
        email,
        password,
      });
  
      console.log('✅ Full response:', response);
      console.log('✅ Response data:', response.data);
  
      const { authorization, user: userData } = response.data;
      const newToken = authorization.token;
      
      console.log('✅ Token received:', newToken ? 'Yes' : 'No');
      console.log('✅ User data:', userData);
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('❌ Error response:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    try {
      const response = await axios.post('http://localhost:8001/api/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const { authorization, user: userData } = response.data;
      const newToken = authorization.token;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {},
      };
    }
  };
  

  const logout = async () => {
    try {
      await axios.post('http://localhost:8001/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const value = {
    token,
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};