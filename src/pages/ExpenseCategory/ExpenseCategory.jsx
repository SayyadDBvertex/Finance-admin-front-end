import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import API from '../../api/api.js';

const ExpenseCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);

  /* ================= FETCH ALL ================= */
  const fetchCategories = async () => {
    try {
      const res = await API.get('/api/expense-category');
      setCategories(res.data.categories || []);
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch expense categories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= OPEN MODAL ================= */
  const openCreateModal = () => {
    setEditId(null);
    setName('');
    setImage(null);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditId(category._id);
    setName(category.name);
    setImage(null); // image optional on update
    setShowModal(true);
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return Swal.fire(
        'Warning',
        'Expense category name is required',
        'warning'
      );
    }

    try {
      const formData = new FormData();
      formData.append('name', name);

      if (image) {
        formData.append('image', image); // key MUST be "image"
      }

      if (editId) {
        // UPDATE
        await API.put(`/api/expense-category/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire(
          'Updated',
          'Expense category updated successfully',
          'success'
        );
      } else {
        // CREATE
        await API.post('/api/expense-category', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire(
          'Created',
          'Expense category created successfully',
          'success'
        );
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      Swal.fire(
        'Error',
        err.response?.data?.message || 'Something went wrong',
        'error'
      );
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This expense category will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/api/expense-category/${id}`);
      Swal.fire('Deleted', 'Expense category deleted successfully', 'success');
      fetchCategories();
    } catch (err) {
      Swal.fire('Error', 'Delete failed', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Expense Categories</h1>
          <p className="text-sm text-white/80 mt-1">
            View all expense categories
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Category
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full border bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">S/No.</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No expense categories found
              </td>
            </tr>
          ) : (
            categories.map((cat, index) => (
              <tr key={cat._id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{cat.name}</td>
                <td className="border p-2 text-center">
                  {cat.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${cat.image}`}
                      alt="icon"
                      className="w-10 h-10 mx-auto object-cover"
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td className="border p-2 text-center">
                  {cat.status ? 'Active' : 'Inactive'}
                </td>
                <td className="border p-2 space-x-2 text-center">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-4">
              {editId ? 'Update Expense Category' : 'Create Expense Category'}
            </h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Expense Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 mb-3"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full border p-2 mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategory;
