import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api.js";
import defaultAvatar from "../../assets/default.png";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // 🔹 MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  // 🔥 ADDED: tab rename
  const [activeTab, setActiveTab] = useState("transaction");

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 FETCH USERS (UNCHANGED)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/user");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 VIEW TRANSACTIONS (UNCHANGED LOGIC)
  const handleViewTransactions = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setTxLoading(true);
    setActiveTab("transaction");

    try {
      const token = localStorage.getItem("token");
      const [transactionResult] = await Promise.allSettled([
        API.get(`/api/user/transaction/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      if (transactionResult.status === "fulfilled") {
        setTransactions(transactionResult.value.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTxLoading(false);
    }
  };

  console.log(transactions, "ggg");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600">
      <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Manage Users
          </h1>
          <p className="text-sm text-white/80 mt-1">
            View all registered users
          </p>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Profile</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Gender</th>
                    <th className="p-3 text-left">DOB</th>
                    <th className="p-3 text-left">Mobile</th>
                    <th className="p-3 text-left">City</th>
                    <th className="p-3 text-left">State</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Transactions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={u._id}
                      className="border-b last:border-none hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{i + 1}</td>

                      {/* PROFILE */}
                      <td className="p-3">
                        <img
                          src={
                            u.profilePic
                              ? `${import.meta.env.VITE_API_BASE_URL}${
                                  u.profilePic
                                }`
                              : defaultAvatar
                          }
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>

                      <td className="p-3 font-medium whitespace-nowrap">
                        {u.name || "-"}
                      </td>

                      <td className="p-3 text-gray-600 break-all">{u.email}</td>
                      <td className="p-3 capitalize">{u.gender || "-"}</td>

                      <td className="p-3">
                        {u.dob ? new Date(u.dob).toLocaleDateString() : "-"}
                      </td>

                      <td className="p-3">{u.mobile || "-"}</td>

                      <td className="p-3 capitalize">
                        {u?.location?.city || "-"}
                      </td>

                      <td className="p-3 capitalize">
                        {u?.location?.state || "-"}
                      </td>

                      <td className="p-3 capitalize">
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {u.role || "user"}
                        </span>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => handleViewTransactions(u)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs md:text-sm hover:bg-blue-700 transition"
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
      </main>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl">
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg md:text-xl font-bold">
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

            {/* CONTENT */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {txLoading ? (
                <p className="text-center text-gray-500">
                  Loading transactions...
                </p>
              ) : (
                <>
                  {/* ================= TRANSACTION TAB ================= */}
                  {activeTab === "transaction" && (
                    <>
                      {/* INCOME */}
                      <div className="mb-8">
                        <h3 className="text-green-600 font-semibold mb-3">
                          All Transactions
                        </h3>

                        <div className="overflow-x-auto rounded-lg border">
                          <table className="w-full text-sm">
                            <thead className="bg-green-50 text-gray-700 uppercase text-xs">
                              <tr>
                                <th className="px-4 py-3 text-center">
                                  Amount
                                </th>
                                <th className="px-4 py-3 text-left">Type</th>

                                <th className="px-4 py-3 text-left">Note</th>
                                <th className="px-4 py-3 text-left">
                                  Category
                                </th>
                                <th className="px-4 py-3 text-center">
                                  Category Image
                                </th>
                                <th className="px-4 py-3 text-right">
                                  Date & Time
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions?.map((t) => (
                                <tr
                                  key={t._id}
                                  className="border-t hover:bg-gray-50"
                                >
                                  <td
                                    className={`px-4 py-3 text-center font-semibold   ${
                                      t.type == "income"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    } `}
                                  >
                                    ₹{t.amount}
                                  </td>
                                  <td className="px-4 py-3 font-semibold">
                                    {t.type || "—"}
                                  </td>
                                  <td className="px-4 py-3">{t.note || "—"}</td>
                                  <td className="px-4 py-3">
                                    {t.incomeCategoryId
                                      ? t.incomeCategoryId.name
                                      : t.expenseCategoryId
                                      ? t.expenseCategoryId?.name
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {t.incomeCategoryId ? (
                                      <img
                                        src={`${baseURL}${t.incomeCategoryId?.image}`}
                                        className="h-20 w-20 rounded object-cover"
                                        alt="income"
                                        onError={(e) =>
                                          (e.target.style.display = "none")
                                        }
                                      />
                                    ) : t.expenseCategoryId ? (
                                      <img
                                        src={`${baseURL}${t.expenseCategoryId?.image}`}
                                        className="h-20 w-20 rounded object-cover"
                                        alt="expense"
                                        onError={(e) =>
                                          (e.target.style.display = "none")
                                        }
                                      />
                                    ) : (
                                      <div className="h-20 w-20 rounded bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                                        N/A
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-gray-500 text-right">
                                    {new Date(t.createdAt).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                              {transactions?.length === 0 && (
                                <tr>
                                  <td
                                    colSpan="3"
                                    className="py-4 text-center text-gray-400"
                                  >
                                    No income transactions
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
