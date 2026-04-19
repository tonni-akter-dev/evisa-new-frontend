"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/signin");
    }
  }, [router]);

  return (
    <div className="text-4xl">
      Hello This is Admin Dashboard
    </div>
  );
}
