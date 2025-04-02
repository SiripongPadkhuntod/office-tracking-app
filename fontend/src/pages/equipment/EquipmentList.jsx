import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit2, AlertCircle, RefreshCw } from 'lucide-react';
import equipmentService from '../../services/equipmentService';
import AlertMessage from '../../components/AlertMessage';
import Loading from '../../components/Loading';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [filtering, setFiltering] = useState('all');

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getAllEquipment();
      
      if (response.data && Array.isArray(response.data.data)) {
        setEquipment(response.data.data);
      } else {
        console.error('Data received is not in expected format:', response);
        setEquipment([]);
        setMessage({ text: 'รูปแบบข้อมูลไม่ถูกต้อง', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setMessage({ text: 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้', type: 'error' });
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return fetchEquipment();
    }
    
    try {
      setLoading(true);
      const response = await equipmentService.searchEquipment(searchTerm);
      
      if (response.data && Array.isArray(response.data.data)) {
        setEquipment(response.data.data);
      } else {
        console.error('Search data received is not in expected format:', response);
        setEquipment([]);
        if (response.data.status === 401) {
          alert('กรุณาเข้าสู่ระบบใหม่');
          localStorage.removeItem('token');
          window.location.reload();
        }
        setMessage({ text: 'รูปแบบผลการค้นหาไม่ถูกต้อง', type: 'error' });
      }
    } catch (error) {
      console.error('Error searching equipment:', error);
      setMessage({ text: 'การค้นหาล้มเหลว', type: 'error' });
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Repair':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return '●';
      case 'In Repair':
        return '◐';
      case 'Inactive':
        return '○';
      default:
        return '■';
    }
  };

  const handleFilterChange = (filter) => {
    setFiltering(filter);
  };

  const filteredEquipment = equipment.filter(item => {
    if (filtering === 'all') return true;
    return item.status === filtering;
  });

  const renderMobileView = () => (
    <div className="grid grid-cols-1 gap-4 sm:hidden">
      {filteredEquipment.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border ${getStatusColor(item.status)}`}>
              <span className="mr-1">{getStatusIcon(item.status)}</span> {item.status}
            </span>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>ประเภท:</span>
              <span className="font-medium text-gray-700">{item.type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>วันที่ซื้อ:</span>
              <span className="font-medium text-gray-700">{new Date(item.purchase_date).toLocaleDateString('th-TH')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>รายละเอียด:</span>
              <span className="font-medium text-gray-700">{item.details || '-'}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Link 
              to={`/equipment/edit/${item.id}`}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              <Edit2 size={16} className="mr-1" /> แก้ไข
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">รายการอุปกรณ์</h1>
          <Link 
            to="/equipment/add" 
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out shadow-sm text-sm font-medium"
          >
            <PlusCircle size={18} className="mr-2" /> เพิ่มอุปกรณ์ใหม่
          </Link>
        </div>
        
        {message.text && (
          <div className="mb-6">
            <AlertMessage message={message.text} type={message.type} />
          </div>
        )}
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ค้นหาชื่ออุปกรณ์..."
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out shadow-sm whitespace-nowrap flex items-center justify-center"
              >
                <Search size={18} className="mr-1" /> ค้นหา
              </button>
              <button 
                type="button"
                onClick={fetchEquipment} 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition duration-150 ease-in-out shadow-sm"
                title="รีเฟรช"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </form>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filtering === 'all' 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => handleFilterChange('Active')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filtering === 'Active' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">●</span> Active
          </button>
          <button
            onClick={() => handleFilterChange('In Repair')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filtering === 'In Repair' 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">◐</span> In Repair
          </button>
          <button
            onClick={() => handleFilterChange('Inactive')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filtering === 'Inactive' 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">○</span> Inactive
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loading />
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลอุปกรณ์</p>
            <p className="text-gray-400 text-sm mt-2">ลองเปลี่ยนคำค้นหาหรือตัวกรองของคุณ</p>
          </div>
        ) : (
          <>
            {/* Mobile view */}
            {renderMobileView()}
            
            {/* Desktop view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 shadow-sm border-gray-200 border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ประเภท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่ออุปกรณ์
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่ซื้อ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รายละเอียด
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipment.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(item.purchase_date).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                          <span className="mr-1">{getStatusIcon(item.status)}</span> {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.details || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/equipment/edit/${item.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} className="mr-1" /> แก้ไข
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EquipmentList;