import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSuccess(false);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('รหัสผ่านไม่ตรงกัน');
      setIsModalOpen(true);
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร และต้องประกอบด้วยตัวอักษรเล็ก ตัวอักษรใหญ่ และตัวเลข');
      setIsModalOpen(true);
      return;
    }
    
    try {
      // แยกข้อมูลที่จำเป็นสำหรับ API
      const { confirmPassword, ...userData } = formData;
      // เรียกใช้ API register และรับข้อมูลกลับมา
      const apiData = await register(userData);
      
      if (apiData.data) {
        if (apiData.data.message === "Can't add new command when connection is in closed state") {
          setErrorMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ และลองอีกครั้ง');
          setIsModalOpen(true);
          return;
        }
        // ตรวจสอบโครงสร้างข้อมูลที่ได้รับจาก API
        else if (apiData && apiData.data.status === 200) {
          setSuccessMessage('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
          alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
          // setIsSuccess(true);
          // setIsModalOpen(true);
          // หน่วงเวลาก่อนนำผู้ใช้ไปยังหน้าล็อกอิน
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          alert(apiData.data.message || 'ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
          // setErrorMessage(apiData.data.message || 'ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
          // setIsModalOpen(true);
        }
      }
    } catch (error) {
      // กรณีเกิด error จากการเรียก API
      console.error("API Error:", error);
      // ตรวจสอบโครงสร้างของ error object
      let errorMsg = 'การลงทะเบียนล้มเหลว โปรดลองอีกครั้ง';
      if (error.response && error.response.data) {
        errorMsg = error.response.data.message || errorMsg;
      } else if (error.message) {
        errorMsg = error.message;
      }

      setErrorMessage(errorMsg);
      setIsModalOpen(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const closeModal = () => {
    setIsModalOpen(false);

    // ถ้าลงทะเบียนสำเร็จให้นำทางไปยังหน้าล็อกอิน
    if (isSuccess) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-blue-100 shadow-inner">
            <UserPlus size={36} className="text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">ลงทะเบียน</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบจัดการอุปกรณ์
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <div className="relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User size={20} className="text-blue-500" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <div className="relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail size={20} className="text-blue-500" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <div className="relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock size={20} className="text-blue-500" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full py-3 pl-10 pr-12 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="กรอกรหัสผ่าน"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
              <div className="relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock size={20} className="text-blue-500" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full py-3 pl-10 pr-12 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-200 transform hover:scale-101 hover:shadow-lg disabled:opacity-70"
            >
              {loading ? (
                <Loading />
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus size={18} className="mr-2" /> ลงทะเบียน
                </span>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              มีบัญชีอยู่แล้ว?{' '}
              <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modal แจ้งเตือน */}
      {isModalOpen && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300" 
    onClick={closeModal}
  >
    <div 
      className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100" 
      style={{
        animation: 'modalEntrance 0.4s ease-out',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center">
        {isSuccess ? (
          <div className="mb-6">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 mb-5 transform transition-all hover:scale-105 shadow-md">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <p className="text-green-600 font-bold text-2xl">{successMessage}</p>
            <p className="text-gray-600 mt-2 text-sm">การดำเนินการเสร็จสมบูรณ์</p>
          </div>
        ) : (
          <div className="mb-6">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-red-100 mb-5 transform transition-all hover:scale-105 shadow-md">
              <XCircle size={40} className="text-red-600" />
            </div>
            <p className="text-red-600 font-bold text-2xl">{errorMessage}</p>
            <p className="text-gray-600 mt-2 text-sm">โปรดลองอีกครั้งในภายหลัง</p>
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={closeModal}
          className={`text-white ${
            isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          } rounded-xl py-3 px-8 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 ${
            isSuccess ? 'focus:ring-green-500' : 'focus:ring-blue-500'
          } focus:ring-opacity-50`}
        >
          ปิด
        </button>
      </div>
    </div>
    <style jsx>{`
      @keyframes modalEntrance {
        0% {
          opacity: 0;
          transform: scale(0.9) translateY(10px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `}</style>
  </div>
)}
    </div>
  );
}

export default Register;