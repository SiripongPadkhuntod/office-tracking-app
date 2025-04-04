import { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, AlertCircle, RefreshCw, Filter, Calendar, X, ChevronUp, ChevronDown } from 'lucide-react';
import equipmentService from '../../services/equipmentService';
import AlertMessage from '../../components/AlertMessage';
import Loading from '../../components/Loading';
import AddEquipmentModal from '../../components/equipment/AddEquipmentModal';
import EditEquipmentModal from '../../components/equipment/EditEquipmentModal';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name'); // Default search by name
  const [message, setMessage] = useState({ text: '', type: '' });
  const [filtering, setFiltering] = useState('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [dateRange, setDateRange] = useState({
    purchasepurchaseStartDate: '',
    purchaseEndDate: '',
    startCreate: '',
    endCreate: ''
  });
  const [typeFilter, setTypeFilter] = useState('');
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getAllEquipment();

      if (response.data && Array.isArray(response.data.data)) {
        setEquipment(response.data.data);
        // Extract unique equipment types
        const types = [...new Set(response.data.data.map(item => item.type))];
        setEquipmentTypes(types);
      } else {
        console.error('Data received is not in expected format:', response);
        setEquipment([]);
        setMessage({ text: 'รูปแบบข้อมูลไม่ถูกต้อง', type: 'error' });
        if (response.data?.status === 401) {
          setMessage({ text: 'กรุณาเข้าสู่ระบบใหม่', type: 'error' });
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setMessage({ text: 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้', type: 'error' });
      setEquipment([]);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setMessage({ text: 'กรุณาเข้าสู่ระบบใหม่', type: 'error' });
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim() && !typeFilter && !dateRange.purchaseStartDate && !dateRange.purchaseEndDate) {
      return fetchEquipment();
    }

    try {
      setLoading(true);

      // Build search parameters
      const searchParams = {
        searchType,
        searchTerm: searchTerm.trim()
      };

      // Add optional filters if they're set
      if (typeFilter) {
        searchParams.type = typeFilter;
      }

      if (dateRange.purchaseStartDate) {
        searchParams.purchaseStartDate = dateRange.purchaseStartDate;
      }

      if (dateRange.purchaseEndDate) {
        searchParams.purchaseEndDate = dateRange.purchaseEndDate;
      }

      if (dateRange.createdStartDate) {
        searchParams.createdStartDate = dateRange.createdStartDate;
      }

      if (dateRange.createdEndDate) {
        searchParams.createdEndDate = dateRange.createdEndDate;
      }

      const response = await equipmentService.searchEquipment(searchParams);

      if (response.data && Array.isArray(response.data.data)) {
        setEquipment(response.data.data);

        if (response.data.data.length === 0) {
          setMessage({ text: 'ไม่พบข้อมูลที่ค้นหา', type: 'info' });
        } else {
          setMessage({ text: '', type: '' });
        }
      } else {
        console.error('Search data received is not in expected format:', response);
        setEquipment([]);
        if (response.data?.status === 401) {
          setMessage({ text: 'กรุณาเข้าสู่ระบบใหม่', type: 'error' });
          localStorage.removeItem('token');
          window.location.href = '/';
        } else {
          setMessage({ text: 'รูปแบบผลการค้นหาไม่ถูกต้อง', type: 'error' });
        }
      }
    } catch (error) {
      console.error('Error searching equipment:', error);
      setMessage({ text: 'การค้นหาล้มเหลว', type: 'error' });
      setEquipment([]);

      // Handle authentication errors
      if (error.response?.status === 401) {
        setMessage({ text: 'กรุณาเข้าสู่ระบบใหม่', type: 'error' });
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSearchType('name');
    setTypeFilter('');
    setDateRange({ purchaseStartDate: '', purchaseEndDate: '', createdStartDate: '', createdEndDate: '' });
    fetchEquipment();

  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Repair':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Disposed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'Disposed':
        return '☒';
      default:
        return '■';
    }
  };

  const handleFilterChange = (filter) => {
    setFiltering(filter);
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted items
  const getSortedItems = () => {
    let sortableItems = [...equipment];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle date comparison
        if (sortConfig.key === 'purchase_date') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          if (sortConfig.direction === 'asc') {
            return dateA - dateB;
          }
          return dateB - dateA;
        }

        if (sortConfig.key === 'created_at') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          if (sortConfig.direction === 'asc') {
            return dateA - dateB;
          }
          return dateB - dateA;
        }

        // Handle string comparison (case insensitive)
        if (typeof a[sortConfig.key] === 'string' && typeof b[sortConfig.key] === 'string') {
          const valueA = a[sortConfig.key].toLowerCase();
          const valueB = b[sortConfig.key].toLowerCase();
          if (valueA < valueB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }

        // Handle number comparison
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  // Filter sorted items
  const filteredEquipment = getSortedItems().filter(item => {
    if (filtering === 'all') return true;
    return item.status === filtering;
  });

  // Component for sort indicator
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <span className="text-gray-300 ml-1 inline-block group-hover:text-gray-400">
          <ChevronUp size={14} className="mb-0.5" />
          <ChevronDown size={14} className="mt-0.5" />
        </span>
      );
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={16} className="ml-1 inline-block text-blue-600" />
    ) : (
      <ChevronDown size={16} className="ml-1 inline-block text-blue-600" />
    );
  };

  // Open add modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (id) => {
    setSelectedEquipmentId(id);
    setIsEditModalOpen(true);
  };

  // Handle success after add/edit/delete
  const handleOperationSuccess = () => {
    fetchEquipment();
    setMessage({ text: 'ดำเนินการสำเร็จ', type: 'success' });

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

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
              <span>รหัส:</span>
              <span className="font-medium text-gray-700">{item.id || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>ประเภท:</span>
              <span className="font-medium text-gray-700">{item.type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>วันที่ซื้อ:</span>
              <span className="font-medium text-gray-700">{new Date(item.purchase_date).toLocaleDateString('en-US')}</span>
            </div>

            <div className="flex justify-between py-1">
              <span>รายละเอียด:</span>
              <span className="font-medium text-gray-700">{item.details || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>วันที่สร้าง:</span>
              <span className="font-medium text-gray-700">{new Date(item.created_at).toLocaleDateString('en-US')}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => openEditModal(item.id)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              <Edit2 size={16} className="mr-1" /> แก้ไข
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">รายการอุปกรณ์</h1>
        <button
          onClick={openAddModal}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-150 ease-in-out shadow-sm text-sm font-medium"
        >
          <PlusCircle size={18} className="mr-2" /> เพิ่มอุปกรณ์ใหม่
        </button>
      </div>

      {message.text && (
        <div className="mb-6">
          <AlertMessage message={message.text} type={message.type} />
        </div>
      )}

      <div className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                </div>
                <div className="flex relative">
                  {/* ไอคอนแว่นขยาย */}
                  <Search size={18} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />

                  {/* Dropdown สำหรับเลือกประเภทการค้นหา */}
                  <select
                    className="pl-8 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm py-2 px-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="name">ชื่ออุปกรณ์</option>
                    <option value="code">รหัสอุปกรณ์</option>
                  </select>

                  {/* ช่องค้นหา */}
                  <input
                    type="text"
                    placeholder={`ค้นหาตาม${searchType === 'name' ? 'ชื่อ' : 'รหัส'}...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
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
                  onClick={resetSearch}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition duration-150 ease-in-out shadow-sm flex items-center"
                  title="รีเซ็ตการค้นหา"
                >
                  <X size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  className={`${showAdvancedSearch ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-3 py-2 rounded-md transition duration-150 ease-in-out shadow-sm flex items-center`}
                  title="ค้นหาขั้นสูง"
                >
                  <Filter size={18} />
                </button>
                <button
                  type="button"
                  onClick={fetchEquipment}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md transition duration-150 ease-in-out shadow-sm flex items-center"
                  title="รีเฟรช"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {showAdvancedSearch && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทอุปกรณ์</label>
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">-- เลือกประเภท --</option>
                    {equipmentTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" /> วันที่เริ่มต้น (Purchase)
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.purchaseStartDate}
                    onChange={(e) => setDateRange({ ...dateRange, purchaseStartDate: e.target.value })}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" /> วันที่สิ้นสุด (Purchase)
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.purchaseEndDate}
                    onChange={(e) => setDateRange({ ...dateRange, purchaseEndDate: e.target.value })}
                    min={dateRange.purchaseStartDate}
                  />
                </div>



                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" />  วันที่เริ่มต้น (Created)
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.createdStartDate}
                    onChange={(e) => setDateRange({ ...dateRange, createdStartDate: e.target.value })}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" /> วันที่สิ้นสุด (Created)
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.createdEndDate}
                    onChange={(e) => setDateRange({ ...dateRange, createdEndDate: e.target.value })}
                    min={dateRange.createdStartDate}
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filtering === 'all'
            ? 'bg-blue-100 text-blue-800 border border-blue-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
        >
          ทั้งหมด
        </button>
        <button
          onClick={() => handleFilterChange('Active')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filtering === 'Active'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
        >
          <span className="mr-1">●</span> Active
        </button>
        <button
          onClick={() => handleFilterChange('In Repair')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filtering === 'In Repair'
            ? 'bg-amber-100 text-amber-800 border border-amber-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
        >
          <span className="mr-1">◐</span> In Repair
        </button>
        <button
          onClick={() => handleFilterChange('Inactive')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filtering === 'Inactive'
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
        >
          <span className="mr-1">○</span> Inactive
        </button>
        <button
          onClick={() => handleFilterChange('Disposed')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${filtering === 'Disposed'
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
        >
          <span className="mr-1">☒</span> Disposed
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
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => requestSort('id')}
                  >
                    รหัส <SortIcon columnKey="id" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => requestSort('type')}
                  >
                    ประเภท <SortIcon columnKey="type" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => requestSort('name')}
                  >
                    ชื่ออุปกรณ์ <SortIcon columnKey="name" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => requestSort('purchase_date')}
                  >
                    วันที่ซื้อ <SortIcon columnKey="purchase_date" />
                  </th>

                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => requestSort('status')}
                  >
                    สถานะ <SortIcon columnKey="status" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => requestSort('created_at')}
                  >
                    วันที่สร้าง <SortIcon columnKey="created_at" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                    onClick={() => requestSort('details')}
                  >
                    รายละเอียด <SortIcon columnKey="details" />
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
                      {item.id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(item.purchase_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                        <span className="mr-1">{getStatusIcon(item.status)}</span> {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(item.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.details || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(item.id)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} className="mr-1" /> แก้ไข
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddEquipmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleOperationSuccess}
          equipmentTypes={equipmentTypes}
        />
      )}

      {isEditModalOpen && (
        <EditEquipmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEquipmentId(null);
          }}
          onSuccess={handleOperationSuccess}
          equipmentId={selectedEquipmentId}
          equipmentTypes={equipmentTypes}
        />
      )}
    </div>
  );
}

export default EquipmentList;