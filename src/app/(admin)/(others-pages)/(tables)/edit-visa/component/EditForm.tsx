"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Country {
  name: string;
}

interface Visa {
  _id: string;
  familyName: string;
  givenName: string;
  visaDescription: string;
  dateOfBirth: string;
  documentNumber: string;
  visaGrantNumber: string;
  visaApplicant: string;
  visaGrantDate: string;
  visaExpiryDate: string;
  location: string;
  visaStatus: string;
  periodOfStay: string;
  visaType: string;
  passportCountry: string;
  applicationId: string;
  transactionRef: string;
}



// ✅ Convert to YYYY-MM-DD for input fields
const formatDateForInput = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

const EditForm = () => {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<Visa | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Predefined options
  const visaStatuses = ["In Effect", "Expired", "Cancelled"];
  const visaTypes = ["Visitor", "Student", "Work", "Transit"];

  const requiredFields = [
    "familyName",
    "givenName",
    "visaDescription",
    "documentNumber",
    "visaGrantNumber",
    "visaType",
    "visaGrantDate",
    "visaExpiryDate",
  ];
// 🔥 Add this list of excluded fields (top of component)
const excludedFields = ["_id", "createdAt", "updatedAt", "__v", "mustNotArriveAfter","enterBeforeDate"];

  // Fetch visa data
  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const res = await fetch(`https://visa-consultancy-backend.onrender.com/api/visas/${id}`);
        if (!res.ok) throw new Error("Failed to fetch visa");
        const data = await res.json();
console.log(data)
        setFormData({
          ...data,
          dateOfBirth: formatDateForInput(data.dateOfBirth),
          visaGrantDate: formatDateForInput(data.visaGrantDate),
          visaExpiryDate: formatDateForInput(data.visaExpiryDate),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVisa();
  }, [id]);

  // Fetch countries
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/iamspruce/search-filter-painate-reactjs/main/data/countries.json"
        );
        const data = await res.json();
        const values: Country[] = Object.values(data);
        setCountries(values.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData) return;

  try {
    setSaving(true);

    const dataToSend = {
      ...formData,
      dateOfBirth: formData.dateOfBirth,
      visaGrantDate: formData.visaGrantDate,
      visaExpiryDate: formData.visaExpiryDate,
    };

    const res = await fetch(`https://visa-consultancy-backend.onrender.com/api/visas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (!res.ok) throw new Error("Failed to update visa");
     Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Visa has been updated successfully.",
      timer: 2000,
      showConfirmButton: false,
    });

    router.push("/visa-list");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: message,
    });
  } finally {
    setSaving(false);
  }
};

  if (loading) return <p className="p-4">Loading visa...</p>;
  if (!formData) return <p className="p-4 text-red-500">Visa not found</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 border">
      <h2 className="text-2xl font-semibold mb-6">Edit Visa</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {Object.keys(formData)
        .filter((key) => !excludedFields.includes(key))
          .map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
              {key}
            </label>
            {key === "location" || key === "passportCountry" ? (
              <select
                name={key}
                value={formData[key as keyof Visa] || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
                required={key === "location"}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : key === "visaStatus" ? (
              <select
                name="visaStatus"
                value={formData.visaStatus}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
              >
                {visaStatuses.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : key === "visaType" ? (
              <select
                name="visaType"
                value={formData.visaType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
              >
                {visaTypes.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={key.toLowerCase().includes("date") ? "date" : "text"}
                name={key}
                value={formData[key as keyof Visa] || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
                required={requiredFields.includes(key)}
              />
            )}
          </div>
        ))}

        <div className="col-span-1 md:col-span-3 flex justify-end mt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Visa"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditForm;
