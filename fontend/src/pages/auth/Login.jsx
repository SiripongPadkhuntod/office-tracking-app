import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import Loading from '../../components/Loading';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage('');

    if (!email || !password) {
      setAlertType('error');
      setAlertMessage('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      const response = await login(email, password, rememberMe);
    
      if (response.success === true) {
        // แสดง toast แจ้งเตือนสำเร็จก่อนนำทาง (ถ้ามี toast component)
        // toast.success('เข้าสู่ระบบสำเร็จ');
        navigate('/equipment');
      } else {
        if (response.message === "Can't add new command when connection is in closed state") {
          setAlertType('error');
          setAlertMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ และลองอีกครั้ง');
        } else {
          setAlertType('error');
          setAlertMessage(response.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล');
        }
      }
    } catch (error) {
      if (!error.response) {
        setAlertType('error');
        setAlertMessage('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณ และลองอีกครั้ง');
        return;
      }
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'เข้าสู่ระบบล้มเหลว โปรดตรวจสอบอีเมลและรหัสผ่าน');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const forgotPassword = () => {
    // แสดง dialog หรือ modal แทนการใช้ alert
    setAlertType('info');
    setAlertMessage('กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่านของคุณ');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 transition-all duration-300">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-300">
            <LogIn size={32} className="text-blue-600" />
          </div>
          <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">
            เข้าสู่ระบบ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            เข้าสู่ระบบจัดการอุปกรณ์ของคุณ
          </p>
        </div>

        {alertMessage && (
          <AlertMessage message={alertMessage} type={alertType} />
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-blue-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out sm:text-sm"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-blue-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out sm:text-sm"
                  placeholder="รหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-blue-500" />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                จดจำฉัน
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={forgotPassword}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none transition-colors duration-200"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-blue-200 transition-all duration-300 ease-in-out"
            >
              {loading ? (
                <Loading />
              ) : (
                <span className="flex items-center">
                  <LogIn size={18} className="mr-2" />
                  เข้าสู่ระบบ
                </span>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ยังไม่มีบัญชี?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 underline-offset-2 hover:underline transition duration-200 ease-in-out">
                ลงทะเบียนใหม่
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;