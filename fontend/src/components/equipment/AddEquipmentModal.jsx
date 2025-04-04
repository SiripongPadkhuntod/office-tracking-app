// src/components/equipment/AddEquipmentModal.jsx
import { useState } from 'react';
import equipmentService from '../../services/equipmentService';
import AlertMessage from '../AlertMessage';
import Loading from '../Loading';
import Modal from '../Modal';

function AddEquipmentModal({ isOpen, onClose, onSuccess }) {
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
      
      // Call success callback and close modal after short delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'เพิ่มอุปกรณ์ล้มเหลว', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      purchase_date: '',
      details: '',
      status: 'Active'
    });
    setMessage({ text: '', type: '' });
  };

  // Reset form when modal closes
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="เพิ่มอุปกรณ์ใหม่" size="lg">
      {message.text && <AlertMessage message={message.text} type={message.type} />}
      
      <form onSubmit={handleSubmit}>
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
            <option value="Printer">Printer</option>
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
        
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={handleClose}
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
    </Modal>
  );
}

export default AddEquipmentModal;