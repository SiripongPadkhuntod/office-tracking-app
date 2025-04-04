import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import Loading from '../../components/Loading';

function Profile() {
  const { currentUser, fetchProfile, loading } = useAuth();
  const [message, setMessage] = useState({ text: '', type: '' });

  // useEffect(() => {
  //   const loadProfile = async () => {
  //     try {
  //       await fetchProfile();
  //     } catch (error) {
  //       setMessage({ text: 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', type: 'error' });
  //     }
  //   };
    
  //   loadProfile();
  // }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loading />
      </div>
    );
  }

  const handleEditProfile = () => {
    // Logic for editing profile can be added here
    setMessage({ text: 'ฟีเจอร์นี้ยังไม่พร้อมใช้งาน', type: 'info' });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 1500);
    
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">โปรไฟล์ผู้ใช้</h1>
      </div>
      
      {message.text && (
        <div className="mb-6">
          <AlertMessage message={message.text} type={message.type} />
        </div>
      )}
      
      {currentUser && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header with Avatar */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-white/30 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {currentUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-semibold text-white">{currentUser.name}</h2>
                <p className="text-blue-100">{currentUser.email}</p>
                {currentUser.role && (
                  <span className="mt-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {currentUser.role}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ข้อมูลส่วนตัว
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                <div className="text-sm font-medium text-gray-500">ชื่อ</div>
                <div className="text-sm text-gray-900 sm:col-span-2">
                  {currentUser.name}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
                <div className="text-sm font-medium text-gray-500">อีเมล</div>
                <div className="text-sm text-gray-900 sm:col-span-2">
                  {currentUser.email}
                </div>
              </div>
              
              {currentUser.role && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
                  <div className="text-sm font-medium text-gray-500">บทบาท</div>
                  <div className="text-sm text-gray-900 sm:col-span-2">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            <button 
              onClick={handleEditProfile}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              แก้ไขโปรไฟล์
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;