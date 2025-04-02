// src/components/Layout.jsx
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function Layout() {
  const { currentUser, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-700 text-white p-4 shadow-md rounded-b-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/home" className="text-white text-xl font-bold hover:underline">
            Office Tracking System
          </Link>
          {currentUser && (
            <nav className="flex gap-4 flex-wrap">
              <Link to="/equipment" className="hover:text-gray-300 transition">อุปกรณ์</Link>
              <Link to="/users" className="hover:text-gray-300 transition">ผู้ใช้งาน</Link>
              <Link to="/profile" className="hover:text-gray-300 transition">โปรไฟล์</Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1 border border-white rounded hover:bg-white hover:text-blue-700 transition"
              >
                ออกจากระบบ
              </button>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
        <Outlet />
      </main>
      
      <footer className="bg-gray-300 p-4 text-center shadow-inner rounded-t-lg mt-4">
        <p className="text-gray-700">&copy; 2025 Office Tracking System</p>
      </footer>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">ยืนยันการออกจากระบบ</h2>
            <p className="mb-4">คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;