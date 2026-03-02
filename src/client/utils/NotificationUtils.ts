// 通知工具函数
export const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) => {
  // 创建通知容器（如果不存在）
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.position = 'fixed';
    notificationContainer.style.top = '20px';
    notificationContainer.style.left = '50%';
    notificationContainer.style.transform = 'translateX(-50%)';
    notificationContainer.style.zIndex = '10000';
    notificationContainer.style.maxWidth = '400px';
    notificationContainer.style.width = '90%';
    document.body.appendChild(notificationContainer);
  }

  // 创建通知元素
  const notification = document.createElement('div');
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = '8px';
  notification.style.color = 'white';
  notification.style.fontWeight = 'bold';
  notification.style.textAlign = 'center';
  notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  notification.style.marginBottom = '10px';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(-20px)';
  notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  // 根据类型设置样式
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#10b981'; // green-500
      break;
    case 'error':
      notification.style.backgroundColor = '#ef4444'; // red-500
      break;
    case 'warning':
      notification.style.backgroundColor = '#f59e0b'; // amber-500
      break;
    case 'info':
    default:
      notification.style.backgroundColor = '#3b82f6'; // blue-500
      break;
  }

  notification.textContent = message;
  notificationContainer.appendChild(notification);

  // 触发动画
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);

  // 自动移除
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
};

// 快捷方法
export const showSuccess = (message: string, duration: number = 3000) => {
  showNotification(message, 'success', duration);
};

export const showError = (message: string, duration: number = 3000) => {
  showNotification(message, 'error', duration);
};

export const showWarning = (message: string, duration: number = 3000) => {
  showNotification(message, 'warning', duration);
};

export const showInfo = (message: string, duration: number = 3000) => {
  showNotification(message, 'info', duration);
};