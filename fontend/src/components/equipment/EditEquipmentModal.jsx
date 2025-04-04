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

  const equipmentTypes = [
    { value: "Laptop", label: "Laptop" },
    { value: "Mobile", label: "Mobile" },
    { value: "Desktop", label: "Desktop" },
    { value: "Monitor", label: "Monitor" },
    { value: "Peripheral", label: "Peripheral" },
    { value: "Other", label: "Other" }
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "In Repair", label: "In Repair" },
    { value: "Inactive", label: "Inactive" },
    { value: "Disposed", label: "Disposed" }
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="แก้ไขข้อมูลอุปกรณ์" size="lg">
      {message.text && (
        <div className="mb-4">
          <AlertMessage message={message.text} type={message.type} />
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loading />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                ประเภทอุปกรณ์
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">เลือกประเภทอุปกรณ์</option>
                {equipmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                สถานะ
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
              รายละเอียด
            </label>
            <textarea
              id="details"
              name="details"
              placeholder="รายละเอียดอุปกรณ์"
              value={formData.details || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
            />
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                ลบ
              </button>
            </div>
            <button
              type="submit"
              disabled={loadingSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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