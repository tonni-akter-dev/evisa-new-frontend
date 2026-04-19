import { Metadata } from "next";
import React from "react";
import EVisaTable from "./EVisaListTable";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default function BasicTables() {
  return (
    <div>
      <div className="space-y-6">
          <EVisaTable />
      </div>
    </div>
  );
}
