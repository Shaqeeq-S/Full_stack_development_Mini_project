import React, { createContext, useContext, useState, useCallback } from 'react';

// Context to provide notification functions
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message, duration = 4000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  const value = {
    notifySuccess: (msg) => addNotification('success', msg),
    notifyError: (msg) => addNotification('error', msg),
    notifyInfo: (msg) => addNotification('info', msg),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Notification container */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-2 rounded-md shadow-md text-white text-sm min-w-[200px] 
              ${n.type === 'success' ? 'bg-green-600' : ''}
              ${n.type === 'error' ? 'bg-red-600' : ''}
              ${n.type === 'info' ? 'bg-blue-600' : ''}`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
