import type { Metadata } from "next";
import DashboardGuard from "@/components/DashboardGuard";

export const metadata: Metadata = {
  title: "Visa Consultancy Admin Dashboard",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return <DashboardGuard />;
}
