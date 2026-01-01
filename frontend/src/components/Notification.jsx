import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Notification = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bg: 'bg-blossom-green-bg',
      border: 'border-blossom-green-text',
      text: 'text-blossom-green-text',
      icon: <CheckCircle className="w-5 h-5" />
    },
    error: {
      bg: 'bg-blossom-red-bg',
      border: 'border-blossom-red-text',
      text: 'text-blossom-red-text',
      icon: <XCircle className="w-5 h-5" />
    },
    info: {
      bg: 'bg-blossom-bg',
      border: 'border-blossom-pink',
      text: 'text-blossom-dark',
      icon: <Info className="w-5 h-5" />
    }
  };

  const config = typeConfig[type];

  return (
    <div className={`fixed top-4 right-4 z-50 ${config.bg} border ${config.border} rounded-blossom shadow-blossom p-4 min-w-64 max-w-md transform transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={config.text}>
            {config.icon}
          </div>
          <div>
            <p className={`font-medium ${config.text}`}>
              {type === 'success' ? 'Success!' : type === 'error' ? 'Error' : 'Notice'}
            </p>
            <p className="text-blossom-dark text-sm mt-1">{message}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(), 300);
          }}
          className="text-blossom-pink hover:text-blossom-dark transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;