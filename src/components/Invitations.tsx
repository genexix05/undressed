import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const Invitations: React.FC = () => {
  const { accessToken, brandId } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [message, setMessage] = useState('');

  const handleInviteByUsername = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/invite-username',
        { username, brandId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessage(`Invitation sent to ${username}`);
    } catch (err) {
      setMessage('Error sending invitation');
      console.error(err);
    }
  };

  const handleInviteByEmail = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/invite-email',
        { email },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessage(`Invitation email sent to ${email}`);
    } catch (err) {
      setMessage('Error sending invitation');
      console.error(err);
    }
  };

  const handleGenerateInviteLink = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/generate-invite-link',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setInviteLink(response.data.inviteLink);
      setMessage('Invitation link generated');
    } catch (err) {
      setMessage('Error generating invitation link');
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-white shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">Send Invitations</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Invite by Username</label>
        <input
          type="text"
          className="mt-1 p-2 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleInviteByUsername}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Invite by Email</label>
        <input
          type="email"
          className="mt-1 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleInviteByEmail}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
      {message && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default Invitations;
