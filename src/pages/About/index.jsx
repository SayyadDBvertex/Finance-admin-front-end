import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import Swal from "sweetalert2";
import API from "../../api/api";

export const AboutUs = () => {
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔹 FETCH PRIVACY POLICY
  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/admin/about-us");
      setData(res.data?.data?.data || "");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch about us");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  // 🔹 SAVE PRIVACY POLICY
  const saveAbout = async () => {
    try {
      setSaving(true);
      await API.post("/api/admin/about-us", { data });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to save About us",
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
        About Us
      </h1>

      <ReactQuill
        theme="snow"
        value={data}
        onChange={setData}
        placeholder="Write your About us here..."
        className="h-96 mb-8 text-black text-lg"
        style={{
          backgroundColor: "#fff",
          fontSize: "18px",
        }}
      />

      <div className="flex justify-center">
        <button
          onClick={saveAbout}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 mt-6 rounded-lg hover:bg-blue-700 transition"
        >
          {saving ? "Saving..." : "Save About Us"}
        </button>
      </div>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );



  
};
