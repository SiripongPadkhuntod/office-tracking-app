// src/components/equipment/EditEquipmentModal.jsx
import { useState, useEffect } from 'react';
import equipmentService from '../../services/equipmentService';
import AlertMessage from '../AlertMessage';
import Loading from '../Loading';
import Modal from '../Modal';

function EditEquipmentModal({ isOpen, onClose, onSuccess, equipmentId }) {
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

  // Fetch equipment details when modal opens and equipmentId changes
  useEffect(() => {
    if (isOpen && equipmentId) {
      fetchEquipmentDetails();
    }
  }, [isOpen, equipmentId]);

  const fetchEquipmentDetails = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getEquipmentById(equipmentId);
      
      // Format date to YYYY-MM-DD for input[type=date]
      const purchaseDate = new Date(response.data.data.purchase_date);
      const formattedDate = purchaseDate.toISOString().split('T')[0];
      
      setFormData({
        ...response.data.data,
        purchase_date: formattedDate
      });
      setMessage({ text: '', type: '' });
    } catch (error) {
      setMessage({ text: 'ไม่สามารถโหลดข้อมูลอุปกรณ์ได้', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
      await equipmentService.updateEquipment(equipmentId, formData);
      setMessage({ text: 'อัพเดทอุปกรณ์สำเร็จ', type: 'success' });
      
      // Call success callback and close modal after short delay
      setTimeout(() => {
        onSuccess();
        onClose();
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
        await equipmentService.deleteEquipment(equipmentId);
        onSuccess();
        onClose();
      } catch (error) {
        setMessage({ text: error.response?.data?.message || 'ลบอุปกรณ์ล้มเหลว', type: 'error' });
        setLoadingSubmit(false);
      }
    }
  };

  // Reset message when modal closes
  const handleClose = () => {
    setMessage({ text: '', type: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="แก้ไขข้อมูลอุปกรณ์" size="lg">
      {message.text && <AlertMessage message={message.text} type={message.type} />}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : (
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
              value={formData.details || ''}
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
          
          <div className="flex items-center justify-between mt-6">
            <div>
              <button
                type="button"
                onClick={handleClose}
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
      )}
    </Modal>
  );
}

export default EditEquipmentModal;