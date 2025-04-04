import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
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
      // console.log("Sending registration data:", userData);
      // เรียกใช้ API register และรับข้อมูลกลับมา
      const apiData = await register(userData);
      // console.log("API Response:", apiData);
      if (apiData.data) {
        if (apiData.data.message === "Can't add new command when connection is in closed state") {
          alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ และลองอีกครั้ง');
          return;
        }
        // ตรวจสอบโครงสร้างข้อมูลที่ได้รับจาก API
        else if (apiData && apiData.data.status === 200) {
          alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
          // หน่วงเวลาก่อนนำผู้ใช้ไปยังหน้าล็อกอิน
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          // console.log("API Error Response:", apiData);
          alert(apiData.data.message || 'ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
        }
      }
    } catch (error) {
      // กรณีเกิด error จากการเรียก API
      console.log("API Error:", error);
      // ตรวจสอบโครงสร้างของ error object
      let errorMsg = 'การลงทะเบียนล้มเหลว โปรดลองอีกครั้ง';
      if (error.response && error.response.data) {
        console.log("Error response data:", error.response.data);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
            <UserPlus size={32} className="text-blue-600" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">ลงทะเบียน</h2>
          <p className="mt-2 text-center text-sm text-gray-600">สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบจัดการอุปกรณ์</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User size={20} className="text-gray-400" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail size={20} className="text-gray-400" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock size={20} className="text-gray-400" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full py-3 pl-10 pr-12 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกรหัสผ่าน"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock size={20} className="text-gray-400" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full py-3 pl-10 pr-12 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors duration-200"
            >
              {loading ? <Loading /> : <span className="flex items-center justify-center"><UserPlus size={18} className="mr-2" /> ลงทะเบียน</span>}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              มีบัญชีอยู่แล้ว?{' '}
              <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">เข้าสู่ระบบ</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modal แจ้งเตือน - ตรวจสอบว่า isModalOpen เป็น true */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              {isSuccess ? (
                <div className="mb-4">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-600 font-semibold text-lg">{successMessage}</p>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-semibold text-lg">{errorMessage}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeModal}
                className={`text-white ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg py-2 px-4 transition-colors duration-200 font-medium`}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;