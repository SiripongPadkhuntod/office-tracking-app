// src/pages/auth/Profile.jsx
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
      <div className="flex justify-center py-12">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">โปรไฟล์ผู้ใช้</h1>
      
      {message.text && <AlertMessage message={message.text} type={message.type} className="mb-4" />}
      
      {currentUser && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-800">
              ข้อมูลส่วนตัว
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ชื่อ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentUser.name}
                </dd>
              </div>
              <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">อีเมล</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentUser.email}
                </dd>
              </div>
              <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ID ผู้ใช้</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentUser.ID}
                </dd>
              </div>
              {currentUser.role && (
                <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">บทบาท</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {currentUser.role}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;