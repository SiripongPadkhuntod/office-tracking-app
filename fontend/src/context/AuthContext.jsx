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
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);

      // Handle different status codes
      if (response.data) {
        switch (response.data.status) {
          case 500:
            const errorMsg = 'เข้าสู่ระบบล้มเหลว โปรดตรวจสอบอีเมลและรหัสผ่าน';
            setError(errorMsg);
            return { success: false, message: errorMsg };
          
          case 401:
            const unauthorizedMsg = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
            setError(unauthorizedMsg);
            return { success: false, message: unauthorizedMsg };
          
          case 404:
            const notFoundMsg = 'ไม่พบผู้ใช้ในระบบ';
            setError(notFoundMsg);
            return { success: false, message: notFoundMsg };
          
          default:
            // Success case
            if (response.data.token && response.data.user) {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('user', JSON.stringify(response.data.user));
              setCurrentUser(response.data.user);
              return { success: true, user: response.data.user };
            } else {
              // Response doesn't have expected data
              const invalidDataMsg = 'ข้อมูลที่ได้รับไม่ถูกต้อง';
              setError(invalidDataMsg);
              return { success: false, message: invalidDataMsg };
            }
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
      
      if (response.data && response.data.status) {
        switch (response.data.status) {
          case 409:
            const conflictMsg = 'อีเมลนี้ถูกใช้งานแล้ว';
            setError(conflictMsg);
            return { success: false, message: conflictMsg };
            
          case 400:
            const badRequestMsg = 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง';
            setError(badRequestMsg);
            return { success: false, message: badRequestMsg };
            
          default:
            // Success case
            return { success: true, data: response.data };
        }
      }
      
      return { success: true, data: response.data };
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