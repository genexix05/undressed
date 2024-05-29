import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';

interface UserType {
  id: number;
  username: string;
  email: string;
  profile_pic: string | null; 
  role: string;
  status: string;
  portfolio: string;
  created_at: string;
}

const UsersList: React.FC = () => {
  const { accessToken, brandId } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [newRole, setNewRole] = useState<string>('');

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

  const handleEdit = (user: UserType) => {
    setEditingUser(user.id);
    setNewRole(user.role);
  };

  const handleSave = async (id: number) => {
    try {
      await axios.put(`http://localhost:3001/api/users/${id}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUsers(prevUsers => prevUsers.map(user => user.id === id ? { ...user, role: newRole } : user));
      setEditingUser(null);
    } catch (err) {
      const error = err as AxiosError;
      console.error('Error updating role:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Filtrar por nombre"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="overflow-x-auto">
          <div className="flex justify-center">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Nombre</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Rol</th>
                  <th className="py-2 px-4 border-b">Creado</th>
                  <th className="py-2 px-4 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2 px-4 flex items-center">
                      {user.profile_pic ? (
                        <img
                          src={`http://localhost:3001/uploads/${user.profile_pic.split('\\').pop()}`}
                          alt={user.username}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
                          <FaUser className="text-gray-500" />
                        </div>
                      )}
                      <div>{user.username}</div>
                    </td>
                    <td className="py-2 px-4 text-center">{user.email}</td>
                    <td className="py-2 px-4 text-center">
                      {editingUser === user.id ? (
                        <select
                          value={newRole}
                          onChange={e => setNewRole(e.target.value)}
                          className="border p-1 rounded"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                          <option value="guest">Guest</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-center">
                      {editingUser === user.id ? (
                        <button onClick={() => handleSave(user.id)} className="bg-blue-500 text-white px-2 py-1 rounded">
                          Guardar
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                          Editar
                        </button>
                      )}
                    </td>
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
