import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default function BasicTables() {
  return (
    <div>
      <div className="space-y-6">
        {/* <ComponentCard title="Visa table"> */}
          <BasicTableOne />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
}
