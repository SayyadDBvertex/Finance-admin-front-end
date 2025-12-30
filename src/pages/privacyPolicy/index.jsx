import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../../api/api";

export const PrivacyPolicy = () => {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔹 FETCH PRIVACY POLICY
  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/admin/privacy-policy");
      setData(res.data?.data?.data || "");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch privacy policy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  // 🔹 SAVE PRIVACY POLICY
  const savePrivacyPolicy = async () => {
    try {
      setSaving(true);
      await API.post("/api/admin/privacy-policy", { data });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to save privacy policy",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-10 mx-auto bg-white max-w-5xl rounded-xl">
      <h1 className="text-black text-4xl font-bold mb-6 text-center">
        Privacy Policy
      </h1>

      <ReactQuill
        theme="snow"
        value={data}
        onChange={setData}
        placeholder="Write your privacy policy here..."
        className="h-96 mb-8 text-black text-lg"
        style={{
          backgroundColor: "#fff",
          fontSize: "18px",
        }}
      />

      <div className="flex justify-center">
        <button
          onClick={savePrivacyPolicy}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 mt-6 rounded-lg hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save Privacy Policy"}
        </button>
      </div>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
};
