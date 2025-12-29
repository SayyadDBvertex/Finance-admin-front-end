import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const adminAPI = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // 🔹 Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.get('/api/admin/feedback'); // ✅ NO TOKEN');
      setFeedbacks(res.data.data || []);
    } catch (err) {
      setError('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 🔹 Make unique users list (1 user = 1 row)
  const uniqueUsers = Object.values(
    feedbacks.reduce((acc, fb) => {
      const userId = fb.user?._id;
      if (userId && !acc[userId]) {
        acc[userId] = fb; // store first feedback just for table display
      }
      return acc;
    }, {})
  );

  // 🔹 View button handler
  const handleView = (userId) => {
    const filtered = feedbacks.filter((fb) => fb.user?._id === userId);
    setUserFeedbacks(filtered);
    setSelectedUser(filtered[0]?.user || null);
    setOpenModal(true);
  };

  /* =======================
     LOADING / ERROR STATES
     ======================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-lg font-medium">
        Loading feedbacks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  /* =======================
     MAIN UI
     ======================= */

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            User Feedbacks
          </h2>
          <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
            {uniqueUsers.length}
          </span>
        </div>

        {/* Table */}
        {uniqueUsers.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No feedback found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">S/No.</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Latest Feedback</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {uniqueUsers.map((fb, index) => (
                  <tr key={fb.user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{index + 1}</td>

                    <td className="px-4 py-3 font-medium text-gray-800">
                      {fb.user?.name || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {fb.user?.email || 'N/A'}
                    </td>

                    <td className="px-4 py-3 max-w-xs truncate text-gray-700">
                      {fb.message}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-lg">
                        ⭐ {fb.rating}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleView(fb.user._id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =======================
         MODAL
         ======================= */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Feedbacks by{' '}
                <span className="text-green-600 font-semibold">
                  {selectedUser?.name}
                </span>
              </h3>
              <button
                onClick={() => setOpenModal(false)}
                className="text-red-500 hover:text-gray-800 text-lg"
              >
                Close
              </button>
            </div>

            <p className="text-sm text-yellow-500 mb-4">
              {selectedUser?.email}
            </p>

            {/* Feedback List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {userFeedbacks.map((fb) => (
                <div key={fb._id} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">⭐ {fb.rating}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(fb.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{fb.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
