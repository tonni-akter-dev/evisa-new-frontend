/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface EVisa {
  _id: string;
  surname: string;
  firstName: string;
  dateOfBirth: string;
  citizenship: string;
  passportNumber: string;
  visaNumber: string;
  status: string;
  validity: string;
  visaType: string;
  visitPurpose: string;
  photo: string;
}

export default function EVisaTable() {
  const [visas, setVisas] = useState<EVisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch EVisa
  useEffect(() => {
    const fetchVisas = async () => {
      try {
        const res = await fetch("https://visa-consultancy-backend.onrender.com/api/evisa");
        const data = await res.json();

        // IMPORTANT: your backend returns { success, data }
        setVisas(data.data);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the EVisa",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`https://visa-consultancy-backend.onrender.com/api/evisa/${id}`, {
        method: "DELETE",
      });

      setVisas((prev) => prev.filter((v) => v._id !== id));

      Swal.fire("Deleted!", "EVisa removed", "success");
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:bg-gray-900">
      <h3 className="p-4 text-2xl">All EVisa List</h3>

      <Table>
        {/* HEADER */}
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Photo</TableCell>
            <TableCell isHeader>Surname</TableCell>
            <TableCell isHeader>First Name</TableCell>
            <TableCell isHeader>DOB</TableCell>
            <TableCell isHeader>Citizenship</TableCell>
            <TableCell isHeader>Passport</TableCell>
            <TableCell isHeader>Visa No</TableCell>
            <TableCell isHeader>Type</TableCell>
            <TableCell isHeader>Validity</TableCell>
            <TableCell isHeader>Status</TableCell>
            <TableCell isHeader>Actions</TableCell>
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {visas.map((visa) => (
            <TableRow key={visa._id}>
              <TableCell>
                {visa.photo ? (
                  <img
                    src={visa.photo}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                ) : (
                  "-"
                )}
              </TableCell>

              <TableCell>{visa.surname}</TableCell>
              <TableCell>{visa.firstName}</TableCell>

              <TableCell>
                {visa.dateOfBirth
                  ? new Date(visa.dateOfBirth).toLocaleDateString()
                  : "-"}
              </TableCell>

              <TableCell>{visa.citizenship}</TableCell>
              <TableCell>{visa.passportNumber}</TableCell>
              <TableCell>{visa.visaNumber}</TableCell>
              <TableCell>{visa.visaType}</TableCell>

              <TableCell>
                {visa.validity
                  ? new Date(visa.validity).toLocaleDateString()
                  : "-"}
              </TableCell>

              <TableCell className="font-medium">
                {visa.status}
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                <TableCell>
  <div className="flex gap-2">
    
    <Link
      href={`/edit-evisa/${visa._id}`}
      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Edit
    </Link>

    <button
      onClick={() => handleDelete(visa._id)}
      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
    >
      Delete
    </button>

  </div>
</TableCell>
                </div>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}