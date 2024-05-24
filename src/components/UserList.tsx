import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

interface UserType {
  id: number;
  username: string;
  email: string;
  profile_pic: string;
  role: string;
  status: string; // Added status
  portfolio: string; // Added portfolio
  created_at: string;
}

const UsersList: React.FC = () => {
  const { accessToken, brandId } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!brandId) return;

      try {
        const response = await axios.get('http://localhost:3001/api/users', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { brandId }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [accessToken, brandId]);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">

        </div>
        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        <div className="overflow-x-auto">
          <div className="flex justify-center">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Position</th>
                  <th className="py-2 px-4 border-b">Created</th>
                  <th className="py-2 px-4 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2 px-4 flex items-center justify-center">
                      <img
                        src={`http://localhost:3001/uploads/${user.profile_pic}`}
                        alt={user.username}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className='text-center'>{user.username}</div>
                    </td>
                    <td className="py-2 px-4 text-center">{user.email}</td>
                    <td className="py-2 px-4 text-center">{user.role}</td>
                    <td className="py-2 px-4 text-center">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-blue-500 hover:underline cursor-pointer text-center">Edit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
