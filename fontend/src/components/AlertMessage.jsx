import { useState } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

function AlertMessage({ message, type = "error" }) {
  const [visible, setVisible] = useState(true);

  if (!message || !visible) return null;

  const alertConfig = {
    error: {
      classes: "bg-red-50 border-l-4 border-red-500 text-red-700",
      icon: <AlertCircle size={20} className="text-red-500" />
    },
    success: {
      classes: "bg-green-50 border-l-4 border-green-500 text-green-700",
      icon: <CheckCircle size={20} className="text-green-500" />
    },
    info: {
      classes: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
      icon: <Info size={20} className="text-blue-500" />
    },
    warning: {
      classes: "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700",
      icon: <AlertTriangle size={20} className="text-yellow-500" />
    }
  };

  const config = alertConfig[type] || alertConfig.info;

  return (
    <div className={`${config.classes} p-4 rounded relative mb-4 flex items-center shadow-sm`} role="alert">
      <div className="mr-3 flex-shrink-0">
        {config.icon}
      </div>
      <span className="flex-1 text-sm">{message}</span>
      <button 
        onClick={() => setVisible(false)} 
        className="ml-4 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
        aria-label="ปิด"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default AlertMessage;