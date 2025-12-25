import React, { useEffect, useState } from 'react';
import API from '../../api/api.js';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/user'); // 🔥 backend API
      console.log('API RESPONSE:', res.data);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-x-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <p className="text-sm text-white/80 mt-1">
            View all registered users
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading users...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3 rounded-l-xl">#</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 rounded-r-xl">Joined At</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-none hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-sm">{index + 1}</td>
                    <td className="p-3 font-medium">{user.name || '-'}</td>
                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                    <td className="p-3 text-sm capitalize">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageUsers;
