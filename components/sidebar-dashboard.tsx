"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  CheckCircle2, 
  Tags, 
  GraduationCap, 
  FileText,
  BookOpen,
  Menu,
  X, User
} from "lucide-react";


export const SidebarDashboard = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Konfigurasi Menu
  const adminMenus = [
    {
      category: "MENU UTAMA",
      items: [
        { label: "Dashboard Overview", href: "/admin/dashboard", icon: LayoutDashboard },
      ]
    },
    {
      category: "USER MANAGEMENT",
      items: [
        { label: "Data Siswa", href: "/admin/students", icon: Users },
        { label: "Instruktur", href: "/admin/instructors", icon: UserRound },
      ]
    },
    {
      category: "CONTENT & LMS",
      items: [
        { label: "Moderasi Kursus", href: "/admin/courses", icon: CheckCircle2 },
      ]
    }
  ];

  const instructorMenus = [
  {
      category: "TEACHING",
      items: [
        { label: "Dashboard Overview", href: "/instructor/dashboard", icon: LayoutDashboard },
        { label: "My Courses", href: "/instructor/courses", icon: BookOpen },
        { label: "Teaching Reports", href: "/instructor/report", icon: FileText },
      ]
    },
    {
      category: "SETTINGS",
      items: [
        { label: "Profile", href: "/instructor/profile", icon: User },
      ]
    }
  ];

  const studentMenus = [
    {
      category: "LEARNING",
      items: [
        { label: "My Classes", href: "/students/course", icon: GraduationCap },
        { label: "Learning Progress", href: "/students/report", icon: FileText },
      ]
    }
  ];

  const getActiveMenus = () => {
    if (pathname.startsWith("/admin")) return adminMenus;
    if (pathname.startsWith("/instructor")) return instructorMenus;
    return studentMenus;
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight text-slate-800">
            LMS<span className="text-blue-600 group-hover:text-blue-500 transition-colors">PRO</span>
          </Link>
        </div>
        <button onClick={toggleSidebar} className="md:hidden text-slate-500 hover:text-rose-500 transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigasi Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        {getActiveMenus().map((section) => (
          <div key={section.category}>
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              {section.category}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-50" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:translate-x-1"
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-colors duration-300 ${
                      isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                    }`} />
                    <span className="text-sm font-semibold transition-all duration-300">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger Button Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-slate-200 h-full">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={toggleSidebar}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};