import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id: number;
  message: string;
  brand_id: number;
  created_at: string;
  readed: 'yes' | 'no';
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

  const handleAcceptInvite = async (brandId: number, notificationId: number) => {
    try {
      await axios.post('http://localhost:3001/api/accept-invite', { brandId }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Marca la notificación como leída
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, readed: 'yes' } : n
      ));
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('An error occurred while accepting the invitation');
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
            {notification.readed === 'no' && (
              <button
                onClick={() => handleAcceptInvite(notification.brand_id, notification.id)}
                className="mt-2 text-white py-1 px-4 rounded bg-blue-500 hover:bg-blue-600"
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
