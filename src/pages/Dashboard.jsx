import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

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
          <h2 className="text-3xl font-bold">1,245</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-gray-500">Transactions</p>
          <h2 className="text-3xl font-bold">8,420</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-3xl font-bold">₹4.6L</h2>
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
