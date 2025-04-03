import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { LogOut, Package, Users, User, Menu, X } from 'lucide-react';

function Layout() {
  const { currentUser, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-blue-700 text-white p-4 shadow-lg relative z-20">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/equipment" className="text-white text-xl font-bold hover:text-gray-100 transition-colors flex items-center">
            <Package size={24} className="mr-2" />
            <span className="hidden sm:inline">Office Tracking System</span>
            <span className="sm:hidden">OTS</span>
          </Link>
          
          {/* Mobile menu button */}
          {currentUser && (
            <button 
              className="md:hidden flex items-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          )}
          
          {/* Desktop Navigation */}
          {currentUser && (
            <nav className="hidden md:flex gap-4 items-center flex-wrap">
              <Link to="/equipment" className="hover:text-gray-200 transition-colors font-medium flex items-center">
                <Package size={18} className="mr-1" />
                อุปกรณ์
              </Link>
              <Link to="/users" className="hover:text-gray-200 transition-colors font-medium flex items-center">
                <Users size={18} className="mr-1" />
                ผู้ใช้งาน
              </Link>
              <Link to="/profile" className="hover:text-gray-200 transition-colors font-medium flex items-center">
                <User size={18} className="mr-1" />
                โปรไฟล์
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-700 transition-colors ml-2 flex items-center"
              >
                <LogOut size={18} className="mr-1" />
                ออกจากระบบ
              </button>
            </nav>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {currentUser && isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-blue-600 shadow-lg z-10">
            <div className="container mx-auto py-2 px-4 flex flex-col">
              <Link 
                to="/equipment" 
                className="py-3 border-b border-blue-500 hover:bg-blue-700 transition-colors font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Package size={18} className="mr-2" />
                อุปกรณ์
              </Link>
              <Link 
                to="/users" 
                className="py-3 border-b border-blue-500 hover:bg-blue-700 transition-colors font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users size={18} className="mr-2" />
                ผู้ใช้งาน
              </Link>
              <Link 
                to="/profile" 
                className="py-3 border-b border-blue-500 hover:bg-blue-700 transition-colors font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} className="mr-2" />
                โปรไฟล์
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-3 text-left hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                <LogOut size={18} className="mr-2" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow container mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-xl my-4 sm:my-6 overflow-x-auto">
        <Outlet />
      </main>
      
      <footer className="bg-white p-4 text-center shadow-lg rounded-t-lg border-t border-gray-200">
        <p className="text-gray-700">&copy; 2025 Office Tracking System</p>
      </footer>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">ยืนยันการออกจากระบบ</h2>
            <p className="mb-6 text-gray-600">คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?</p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium order-2 sm:order-1"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center order-1 sm:order-2"
              >
                <LogOut size={18} className="mr-1" />
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