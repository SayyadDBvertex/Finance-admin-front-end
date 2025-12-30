import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/admin/dashboard");
      setData(res.data || "");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch about us");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-white/80 mt-1">
          Welcome{user?.name ? `, ${user.name}` : ''} 👋
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold">{data?.userCount}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-gray-500">Income Category</p>
          <h2 className="text-3xl font-bold">{data?.incomeCategoryCount}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-gray-500">Expense Category</p>
          <h2 className="text-3xl font-bold">{data?.expenseCategoryCount}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-gray-500">Active Today</p>
          <h2 className="text-3xl font-bold">312</h2>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
