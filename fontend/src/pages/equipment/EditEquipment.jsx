// src/pages/equipment/EditEquipment.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import equipmentService from '../../services/equipmentService';
import AlertMessage from '../../components/AlertMessage';
import Loading from '../../components/Loading';

function EditEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    purchase_date: '',
    details: '',
    status: ''
  });

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        setLoading(true);
        const response = await equipmentService.getEquipmentById(id);
        
        // Format date to YYYY-MM-DD for input[type=date]
        const purchaseDate = new Date(response.data.data.purchase_date);
        const formattedDate = purchaseDate.toISOString().split('T')[0];
        
        setFormData({
          ...response.data.data,
          purchase_date: formattedDate
        });
      } catch (error) {
        setMessage({ text: 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEquipmentDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoadingSubmit(true);
      await equipmentService.updateEquipment(id, formData);
      setMessage({ text: 'อัพเดทอุปกรณ์สำเร็จ', type: 'success' });
      
      // Navigate back to equipment list after short delay
      setTimeout(() => {
        navigate('/equipment');
      }, 1500);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'อัพเดทอุปกรณ์ล้มเหลว', type: 'error' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบอุปกรณ์นี้?')) {
      try {
        setLoadingSubmit(true);
        await equipmentService.deleteEquipment(id);
        navigate('/equipment');
      } catch (error) {
        setMessage({ text: error.response?.data?.message || 'ลบอุปกรณ์ล้มเหลว', type: 'error' });
        setLoadingSubmit(false);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">แก้ไขข้อมูลอุปกรณ์</h1>
      
      {message.text && <AlertMessage message={message.text} type={message.type} />}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            ประเภทอุปกรณ์
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">เลือกประเภทอุปกรณ์</option>
            <option value="Laptop">Laptop</option>
            <option value="Mobile">Mobile</option>
            <option value="Desktop">Desktop</option>
            <option value="Monitor">Monitor</option>
            <option value="Peripheral">Peripheral</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            ชื่ออุปกรณ์
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="ชื่ออุปกรณ์"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="purchase_date">
            วันที่ซื้อ
          </label>
          <input
            id="purchase_date"
            name="purchase_date"
            type="date"
            value={formData.purchase_date}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
            รายละเอียด
          </label>
          <textarea
            id="details"
            name="details"
            placeholder="รายละเอียดอุปกรณ์"
            value={formData.details}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            สถานะ
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Active">Active</option>
            <option value="In Repair">In Repair</option>
            <option value="Inactive">Inactive</option>
            <option value="Disposed">Disposed</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate('/equipment')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              ลบ
            </button>
          </div>
          <button
            type="submit"
            disabled={loadingSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loadingSubmit ? <Loading /> : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEquipment;