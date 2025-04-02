// src/pages/equipment/AddEquipment.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import equipmentService from '../../services/equipmentService';
import AlertMessage from '../../components/AlertMessage';
import Loading from '../../components/Loading';

function AddEquipment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    purchase_date: '',
    details: '',
    status: 'Active'
  });

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
      setLoading(true);
      await equipmentService.addEquipment(formData);
      setMessage({ text: 'เพิ่มอุปกรณ์สำเร็จ', type: 'success' });
      
      // Clear form after success
      setFormData({
        type: '',
        name: '',
        purchase_date: '',
        details: '',
        status: 'Active'
      });
      
      // Navigate back to equipment list after short delay
      setTimeout(() => {
        navigate('/equipment');
      }, 1500);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'เพิ่มอุปกรณ์ล้มเหลว', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">เพิ่มอุปกรณ์ใหม่</h1>
      
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
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/equipment')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? <Loading /> : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEquipment;