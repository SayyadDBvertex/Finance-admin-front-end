import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api.js';
import defaultAvatar from '../../assets/default.png';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🔹 MODAL STATES (NEW – no existing logic touched)
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('income');

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 EXISTING LOGIC (UNCHANGED)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/user');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 EXISTING FUNCTION NAME SAME (ENHANCED ONLY)
  const handleViewTransactions = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setTxLoading(true);
    setActiveTab('income');

    try {
      // Fetch income+expense transactions and split entries in parallel.
      const [txRes, splitRes] = await Promise.allSettled([
        API.get(`/api/user/transaction/${user._id}`),
        API.get(`/api/user/split/${user._id}`),
      ]);

      const txData =
        txRes.status === 'fulfilled' ? txRes.value?.data?.data || [] : [];

      const splitRaw =
        splitRes.status === 'fulfilled' ? splitRes.value?.data?.data || [] : [];

      // Flatten split documents into individual split entries and normalize fields
      const splitFlattened = splitRaw.flatMap((doc) => {
        if (Array.isArray(doc.splitData) && doc.splitData.length > 0) {
          return doc.splitData.map((entry) => ({
            _id:
              entry._id ||
              `${doc._id}-${Math.random().toString(36).slice(2, 8)}`,

            // 👤 NAME + STATUS
            title: `${entry.name} (${entry.paidStatus})` || doc.note || 'Split',

            // 💰 CORRECT SPLIT AMOUNT
            amount: entry.splitAmount ?? doc.amount ?? 0,

            createdAt:
              entry.createdAt || doc.createdAt || new Date().toISOString(),

            transactionType: 'split',
          }));
        }

        return [];
      });

      // Combine and sort by createdAt descending
      const combined = [...txData, ...splitFlattened].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setTransactions(combined || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      <main className="flex-1 p-6 overflow-x-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Users</h1>
          <p className="text-sm text-white/80 mt-1">
            View all registered users
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading users...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600">
                  <th className="p-3">S/No.</th>
                  <th className="p-3">Profile</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">DOB</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Transactions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3">
                      <img
                        src={
                          user.profilePic
                            ? `${import.meta.env.VITE_API_BASE_URL}${
                                user.profilePic
                              }`
                            : defaultAvatar
                        }
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>

                    <td className="p-3 font-medium">{user.name || '-'}</td>
                    <td className="p-3 text-gray-600">{user.email}</td>

                    <td className="p-3 capitalize">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {user.role || 'user'}
                      </span>
                    </td>

                    <td className="p-3">{user.mobile || '-'}</td>
                    <td className="p-3 capitalize">{user.gender || '-'}</td>

                    <td className="p-3">
                      {user.location?.city
                        ? `${user.location.city}, ${user.location.state}`
                        : '-'}
                    </td>

                    <td className="p-3">
                      {user.dob ? new Date(user.dob).toLocaleDateString() : '-'}
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleViewTransactions(user)}
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-purple-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Transactions – {selectedUser?.name}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-gray-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            {/* TABS */}
            <div className="flex gap-3 mb-4">
              {['income', 'expense', 'split'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* TRANSACTIONS */}
            {txLoading ? (
              <p className="text-center text-gray-500">
                Loading transactions...
              </p>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-right">
                          Amount
                        </th>
                        <th className="px-4 py-3 font-semibold">Note</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {transactions
                        .filter((t) => t.transactionType === activeTab)
                        .map((t) => (
                          <tr
                            key={t._id}
                            className="border-t hover:bg-gray-50 transition-colors"
                          >
                            {/* 💰 Amount */}
                            <td
                              className={`px-4 py-3 font-semibold text-right ${
                                activeTab === 'expense'
                                  ? 'text-red-600'
                                  : activeTab === 'income'
                                  ? 'text-green-600'
                                  : t.title?.includes('(paid)')
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              ₹{t.amount}
                            </td>

                            {/* 📝 Note */}
                            <td className="px-4 py-3 text-gray-800">
                              {t.title || t.note || '—'}
                            </td>

                            {/* 📅 Date */}
                            <td className="px-4 py-3 text-gray-500">
                              {new Date(t.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {transactions.filter((t) => t.transactionType === activeTab)
                  .length === 0 && (
                  <p className="text-center text-gray-500 mt-4">
                    No {activeTab} transactions found
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
