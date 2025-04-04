import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        setCurrentUser(JSON.parse(user));
      }
    } catch (err) {
      console.error('Error loading auth state from localStorage:', err);
      // Clear potentially corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // console.log("Login attempt with email:", email); // Log the email being used for login
      setLoading(true);
      setError(null);
      // console.log("Sending login request to server..."); // Log the login request
      const response = await authService.login(email, password);
      // console.log("Login response:", response); // Log the response from the server

      // Handle different status codes
      if (response.data) {
        // Success case
        if (response.data.token && response.data.user) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setCurrentUser(response.data.user);
          return { success: true, user: response.data.user };
        } else {
          setError(response.data.message );
          return { success: false, message: response.data.message  };
        }

      } else {
        setError('ไม่ได้รับข้อมูลตอบกลับจากเซิร์ฟเวอร์');
        return { success: false, message: 'ไม่ได้รับข้อมูลตอบกลับจากเซิร์ฟเวอร์' };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'เข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      if (response.data) {
        // return response.data;
        return { data: response.data  , success: true };
      }
      else{
        setError('ไม่ได้รับข้อมูลตอบกลับจากเซิร์ฟเวอร์');
        return { success: false, message: 'ไม่ได้รับข้อมูลตอบกลับจากเซิร์ฟเวอร์' };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'ลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      navigate('/');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getProfile();

      if (response.data) {
        setCurrentUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        return { success: true, user: response.data };
      } else {
        const noDataMsg = 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้';
        setError(noDataMsg);
        return { success: false, message: noDataMsg };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้';
      setError(errorMessage);

      // If the error is authentication-related, log the user out
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        return { success: false, message: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง' };
      }

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if token is valid
  const isAuthenticated = () => {
    return !!localStorage.getItem('token') && !!currentUser;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    fetchProfile,
    isAuthenticated,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};