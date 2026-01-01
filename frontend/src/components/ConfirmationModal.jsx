import { useEffect } from 'react';
import { AlertTriangle, Info, Archive, Trash2, RefreshCw } from 'lucide-react';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info' // 'info', 'warning', 'danger', 'archive', 'restore', 'delete'
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const typeConfig = {
        info: {
            icon: <Info className="w-6 h-6" />,
            iconColor: 'text-blossom-pink',
            bgColor: 'bg-blossom-pink/10',
            buttonClass: 'btn-blossom'
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6" />,
            iconColor: 'text-blossom-yellow-text',
            bgColor: 'bg-blossom-yellow-bg',
            buttonClass: 'btn-blossom bg-blossom-yellow-text hover:bg-blossom-yellow-text/90'
        },
        danger: {
            icon: <AlertTriangle className="w-6 h-6" />,
            iconColor: 'text-blossom-red-text',
            bgColor: 'bg-blossom-red-bg',
            buttonClass: 'btn-blossom bg-blossom-red-text hover:bg-blossom-red-text/90'
        },
        archive: {
            icon: <Archive className="w-6 h-6" />,
            iconColor: 'text-blossom-pink',
            bgColor: 'bg-blossom-pink/10',
            buttonClass: 'btn-blossom'
        },
        restore: {
            icon: <RefreshCw className="w-6 h-6" />,
            iconColor: 'text-blossom-green-text',
            bgColor: 'bg-blossom-green-bg',
            buttonClass: 'btn-blossom bg-blossom-green-text hover:bg-blossom-green-text/90'
        },
        delete: {
            icon: <Trash2 className="w-6 h-6" />,
            iconColor: 'text-blossom-red-text',
            bgColor: 'bg-blossom-red-bg',
            buttonClass: 'btn-blossom bg-blossom-red-text hover:bg-blossom-red-text/90'
        }
    };

    const config = typeConfig[type] || typeConfig.info;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div 
                className="card-blossom max-w-md w-full transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-full ${config.bgColor}`}>
                        <div className={config.iconColor}>
                            {config.icon}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-heading text-blossom-dark">{title}</h3>
                    </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                    <p className="text-blossom-pink">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="btn-blossom-outline"
                        autoFocus
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={config.buttonClass}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;