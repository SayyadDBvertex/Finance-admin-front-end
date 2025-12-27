import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import API from '../../api/api.js';

const AdminFaq = () => {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  /* ================= FETCH ALL ================= */
  const fetchFaqs = async () => {
    try {
      const res = await API.get('/api/faqs');
      setFaqs(res.data.faqs || []);
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch FAQs', 'error');
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  /* ================= OPEN MODAL ================= */
  const openCreateModal = () => {
    setEditId(null);
    setQuestion('');
    setAnswer('');
    setShowModal(true);
  };

  const openEditModal = (faq) => {
    setEditId(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setShowModal(true);
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      return Swal.fire(
        'Warning',
        'Question and Answer are required',
        'warning'
      );
    }

    try {
      if (editId) {
        // UPDATE
        await API.put(`/api/faqs/${editId}`, {
          question,
          answer,
        });
        Swal.fire('Updated', 'FAQ updated successfully', 'success');
      } else {
        // CREATE
        await API.post('/api/faqs', {
          question,
          answer,
        });
        Swal.fire('Created', 'FAQ created successfully', 'success');
      }

      setShowModal(false);
      fetchFaqs();
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
      text: 'This FAQ will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/api/faqs/${id}`);
      Swal.fire('Deleted', 'FAQ deleted successfully', 'success');
      fetchFaqs();
    } catch (err) {
      Swal.fire('Error', 'Delete failed', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">FAQs</h1>
          <p className="text-sm text-white/80 mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add FAQ
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full border bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-12">S/No.</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faqs.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No FAQs found
              </td>
            </tr>
          ) : (
            faqs.map((faq, index) => (
              <tr key={faq._id} className="hover:bg-gray-50">
                {/* S.No */}
                <td className="border p-2 text-center w-16">{index + 1}</td>

                {/* Question */}
                <td className="border p-3 max-w-[350px]">
                  <p className="text-sm font-medium text-gray-800 break-words">
                    {faq.question}
                  </p>
                </td>

                {/* Answer */}
                <td className="border p-3 max-w-[500px]">
                  <p className="text-sm text-gray-700 break-words">
                    {faq.answer}
                  </p>
                </td>

                {/* Actions */}
                <td className="border p-2 w-32">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(faq)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[500px]">
            <h3 className="text-lg font-bold mb-4">
              {editId ? 'Update FAQ' : 'Create FAQ'}
            </h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border p-2 mb-3"
              />

              <textarea
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border p-2 mb-4 h-28 resize-none"
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

export default AdminFaq;
