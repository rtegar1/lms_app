"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar-landingpage";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Daftar rute yang TIDAK menampilkan Navbar
  const authRoutes = ["/sign-in", "/sign-up"];

  // Jika rute saat ini ada di dalam daftar authRoutes, jangan tampilkan Navbar
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return <Navbar />;
}