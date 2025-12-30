import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  HelpCircle,
  IndianRupee,
  Receipt,
  Share2,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation(); // ✅ ADD THIS
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />,
    },
    {
      name: 'IncomeCategory',
      path: '/admin/income-category',
      icon: <IndianRupee size={20} />,
    },
    {
      name: 'ExpenseCategory',
      path: '/admin/expense-category',
      icon: <Receipt size={20} />,
    },
    {
      name: 'Help & FAQ',
      path: '/admin/faq',
      icon: <HelpCircle size={20} />,
    },
    {
      name: 'Send Feedback',
      path: '/admin/feedback',
      icon: <Share2 size={20} />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside className="h-screen w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col shadow-2xl">
      {/* Logo / Brand */}
      <div className="relative h-20 flex flex-col items-center justify-center border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl"></div>
        <h1 className="relative text-2xl font-extrabold tracking-wide">
          Xpenly
        </h1>
        <span className="relative text-xs text-gray-400">Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
              group relative flex items-center gap-4 px-5 py-3 rounded-xl
              transition-all duration-300
              ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }
            `
            }
          >
            {/* Icon background */}
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-lg
                transition
                ${item.path === '/' ? 'bg-blue-500/20' : 'bg-white/5'}
                group-hover:bg-blue-500/20
              `}
            >
              {item.icon}
            </div>

            <span className="text-sm font-semibold tracking-wide">
              {item.name}
            </span>

            {/* Active indicator */}
            <span
              className={`
                absolute right-3 w-2 h-2 rounded-full
                ${location.pathname === item.path ? 'bg-white' : 'hidden'}
              `}
            />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-5 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-xl
                     text-red-400 hover:text-red-500
                     hover:bg-red-500/10 transition-all duration-300"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
            <LogOut size={20} />
          </div>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
