import React, { useEffect, useState } from 'react';

interface StatusMessageProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ 
  message, 
  type, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 等待淡出动画完成
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 
                  type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  
  const icon = type === 'success' ? '✅' : 
               type === 'error' ? '❌' : 'ℹ️';

  if (!isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default StatusMessage;