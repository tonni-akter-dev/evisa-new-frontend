/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface Country {
  name: string;
}

const AddEVisa = () => {
  const IMGBB_API_KEY = "4e40960ee867d0115a4c0049f45f4572";

  const [formData, setFormData] = useState({
    surname: "",
    firstName: "",
    dateOfBirth: "",
    citizenship: "",
    passportNumber: "",
    visaNumber: "",
    status: "Issued Visa",
    validity: "",
    visaType: "",
    visitPurpose: "",
    photo: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const visaStatuses = ["Issued Visa", "Pending", "Rejected"];
  const visaTypes = ["D", "C", "B"];

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/iamspruce/search-filter-painate-reactjs/main/data/countries.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const values: Country[] = Object.values(data);
        setCountries(values.sort((a, b) => a.name.localeCompare(b.name)));
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ImgBB Upload
  const uploadToImgBB = async (file: File) => {
    const formDataImg = new FormData();
    formDataImg.append("image", file);
    formDataImg.append("key", IMGBB_API_KEY);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formDataImg,
    });

    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error("Upload failed");
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "Image must be under 2MB", "error");
      return;
    }

    setUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const url = await uploadToImgBB(file);
      setFormData((prev) => ({ ...prev, photo: url }));
      Swal.fire("Success", "Image uploaded", "success");
    } catch {
      Swal.fire("Error", "Upload failed", "error");
    }

    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://visa-consultancy-backend.onrender.com/api/evisa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Swal.fire("Success", "EVisa Added", "success");
        setPreview(null);
      } else {
        Swal.fire("Error", "Failed to add visa", "error");
      }
    } catch {
      Swal.fire("Error", "Server error", "error");
    }

    setLoading(false);
  };

  const inputClass =
    "mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 p-3 focus:ring-2 focus:ring-blue-500 outline-none";

  const labelClass =
    "block text-sm font-medium text-gray-600 dark:text-gray-300";

  return (
    <div className="flex justify-center py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg space-y-8"
      >
        <h2 className="text-2xl font-bold">Add New EVisa</h2>

        {/* PERSONAL INFO */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label className={labelClass}>Surname</label>
              <input name="surname" onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>First Name</label>
              <input name="firstName" onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Date of Birth</label>
              <input type="date" name="dateOfBirth" onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Citizenship</label>
              <select name="citizenship" onChange={handleChange} className={inputClass}>
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Passport Number</label>
              <input name="passportNumber" onChange={handleChange} className={inputClass} required />
            </div>

          </div>
        </div>

        {/* VISA INFO */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Visa Information</h3>
          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label className={labelClass}>Visa Number</label>
              <input name="visaNumber" onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select name="status" onChange={handleChange} className={inputClass}>
                {visaStatuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Validity Date</label>
              <input type="date" name="validity" onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Visa Type</label>
              <select name="visaType" onChange={handleChange} className={inputClass}>
                {visaTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Visit Purpose</label>
              <input name="visitPurpose" onChange={handleChange} className={inputClass} />
            </div>

          </div>
        </div>

        {/* IMAGE */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Photo Upload</h3>

          <label className={labelClass}>Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files[0])
            }
            className="mt-2"
          />

          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}

          {preview && (
            <img
              src={preview}
              className="mt-3 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Submitting..." : "Add EVisa"}
        </button>
      </form>
    </div>
  );
};

export default AddEVisa;