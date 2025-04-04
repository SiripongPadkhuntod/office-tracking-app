// src/pages/users/UserList.jsx
import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import AlertMessage from '../../components/AlertMessage';
import Loading from '../../components/Loading';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);  // จำนวนที่จะแสดงในแต่ละหน้า

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setMessage({ text: '', type: '' });
    } catch (error) {
      setMessage({ text: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return fetchUsers();
    }
    
    try {
      setLoading(true);
      const response = await userService.searchUsers(searchTerm);
      setUsers(response.data);
    } catch (error) {
      setMessage({ text: 'การค้นหาล้มเหลว', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // คำนวณการแสดงข้อมูลในแต่ละหน้า
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // การเปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">รายการผู้ใช้</h1>
      </div>
      
      {message.text && <AlertMessage message={message.text} type={message.type} className="mb-4" />}
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 flex-wrap sm:flex-nowrap">
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้ใช้..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
          >
            ค้นหา
          </button>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : currentUsers.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-500 text-lg">ไม่พบข้อมูลผู้ใช้</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUsers.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
              {/* <p className="text-sm text-gray-500">ID: {user.id}</p> */}
              <p className="text-sm text-gray-500">อีเมล: {user.email}</p>
              <div className="mt-4">
                <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {user.role || 'User'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="inline-flex space-x-2">
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'}`}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default UserList;
