"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
  import Swal from "sweetalert2";
  
interface Visa {
  _id: string;
  familyName: string;
  givenName: string;
  dateOfBirth: string;
  documentNumber: string;
  visaDescription: string;
  visaGrantNumber: string;
  visaType: string;
  stream: string;
  visaGrantDate: string;
  visaExpiryDate: string;
  visaStatus: string;
  passportNumber?: string;
  passportCountry?: string;
}

export default function VisaTable() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch visas from API
  useEffect(() => {
    const fetchVisas = async (): Promise<void> => {
      try {
        const res = await fetch("https://visa-consultancy-backend.onrender.com/api/visas");
        if (!res.ok) throw new Error("Failed to fetch visas");
        const data: Visa[] = await res.json();
        setVisas(data); // API should return an array of Visa objects
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVisas();
  }, []);



const handleDelete = async (id: string): Promise<void> => {
  try {
    // 🔹 Step 1: Ask for confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return; // if cancelled, exit

    // 🔹 Step 2: Call API
    const res = await fetch(
      `https://visa-consultancy-backend.onrender.com/api/visas/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) throw new Error("Failed to delete visa");

    // 🔹 Step 3: Update UI
    setVisas((prev) => prev.filter((visa) => visa._id !== id));

    // 🔹 Step 4: Success message
    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Visa has been deleted successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: message,
    });
  }
};

  if (loading) return <p className="p-4">Loading visas...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full ">
        <div className="">
          <h3 className="p-4 text-2xl">All Visa List</h3>
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  Family Name
                </TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  Given Name
                </TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  DOB
                </TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  Passport No.
                </TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  Visa Grant Number
                </TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  Grant Date
                </TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  Expiry Date
                </TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  Status
                </TableCell>
                <TableCell isHeader className="px-3 py-3 font-medium text-gray-500">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {visas.map((visa) => (
                <TableRow key={visa._id}>
                  <TableCell className="px-3 py-3">{visa.familyName}</TableCell>
                  <TableCell className="px-3 py-3">{visa.givenName}</TableCell>
                  <TableCell className="px-3 py-3">
                    {visa.dateOfBirth
                      ? new Date(visa.dateOfBirth).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="px-3 py-3">{visa.documentNumber}</TableCell>
                  <TableCell className="px-3 py-3">{visa.visaGrantNumber}</TableCell>
                  <TableCell className="px-3 py-3">
                    {visa.visaGrantDate
                      ? new Date(visa.visaGrantDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    {visa.visaExpiryDate
                      ? new Date(visa.visaExpiryDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="px-3 py-3 font-medium">
                    {visa.visaStatus}
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/edit-visa/${visa._id}`}
                        className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(visa._id)}
                        className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
