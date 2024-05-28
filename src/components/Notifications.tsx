import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id: number;
  message: string;
  brand_id: number | null;
  created_at: string;
  readed: 'yes' | 'no';
  price_change?: 'increased' | 'decreased';
}

const Notifications: React.FC = () => {
  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/notifications', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setNotifications(response.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('An error occurred while fetching notifications');
      }
    };

    fetchNotifications();
  }, [accessToken]);

  const handleAcceptNotification = async (notificationId: number, brandId?: number | null) => {
    try {
      if (brandId) {
        await axios.post('http://localhost:3001/api/accept-invite', { brandId }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      await axios.post(`http://localhost:3001/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, readed: 'yes' } : n
      ));
    } catch (err) {
      console.error('Error updating notification:', err);
      setError('An error occurred while updating the notification');
    }
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map(notification => (
          <div key={notification.id} className="bg-white shadow p-4 mb-4 rounded-lg">
            <p>{notification.message}</p>
            {notification.price_change && (
              <p className={`text-${notification.price_change === 'increased' ? 'green' : 'red'}-500`}>
                Price {notification.price_change}
              </p>
            )}
            {notification.readed === 'no' && (
              <button
                onClick={() => handleAcceptNotification(notification.id, notification.brand_id)}
                className="mt-2 text-white py-1 px-4 rounded bg-gray-500 hover:bg-gray-600 w-full"
              >
                Accept
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
