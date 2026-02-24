"use client";

import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, ShieldCheck, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

interface UserButtonCustomProps {
  role?: string | null; // Dibuat opsional agar fleksibel
}

export const UserButtonCustom = ({ role: initialRole }: UserButtonCustomProps) => {
  const pathname = usePathname();

  // Logika deteksi role: prioritas dari props, jika tidak ada cek path URL
  const getRole = () => {
    if (initialRole) return initialRole; // Gunakan role dari metadata/database jika ada
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/instructor")) return "instructor";
    return "student";
  };

  const role = getRole();

  return (
    <UserButton
      appearance={{
        elements: {
          footer: "hidden", 
          devButton: "hidden",
          userButtonPopoverFooter: "hidden" 
        },
      }}
    >
      <UserButton.MenuItems>
        {/* Link umum untuk semua student */}
        {role === 'student' && (
        <UserButton.Link
          label="My Dashboard"
          labelIcon={<LayoutDashboard className="h-4 w-4" />}
          href="/student/dashboard"
        />
        )}

        {/* Muncul jika role adalah instructor */}
        {role === 'instructor' && (
          <UserButton.Link
            label="Instructor Panel"
            labelIcon={<UserCircle className="h-4 w-4" />}
            href="/instructor/dashboard"
          />
        )}

        {/* Muncul hanya jika role adalah admin */}
        {role === 'admin' && (
          <UserButton.Link
            label="Admin Settings"
            labelIcon={<ShieldCheck className="h-4 w-4" />}
            href="/admin/dashboard"
          />
        )}
      </UserButton.MenuItems>
    </UserButton>
  );
};