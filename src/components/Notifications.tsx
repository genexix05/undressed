import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Notification {
  id: number;
  message: string;
  brand_id: number;
  created_at: string;
  read: 'yes' | 'no';
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

  const handleAcceptInvite = async (notificationId: number, brandId: number) => {
    try {
      await axios.post(
        'http://localhost:3001/api/accept-invite',
        { notificationId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('An error occurred while accepting the invitation');
    }
  };

  return (
    <div className="p-8 bg-white shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} className="mb-4 p-4 border border-gray-200 rounded">
            <p className="mb-2">{notification.message}</p>
            <button
              onClick={() => handleAcceptInvite(notification.id, notification.brand_id)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Accept
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
