"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton, SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, User, GraduationCap, ArrowLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserButtonCustom } from "./user-button-custom"; // Memastikan custom menu dashboard muncul

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [role, setRole] = useState<"student" | "instructor" | null>(null);
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

// Mengambil role user dari metadata Clerk (disinkronkan dengan Supabase di backend)
  // Di dalam file navbar.tsx
useEffect(() => {
  const fetchUserRole = async () => {
    if (isSignedIn && user) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      );
      // Ambil data role langsung dari tabel profiles di Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        // Jika di Supabase "admin", maka userRole akan menjadi "admin"
        setUserRole(data.role);
      } else {
        // Fallback jika data tidak ditemukan
        setUserRole("student");
      }
    }
  };

  fetchUserRole();
}, [isSignedIn, user]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/40 backdrop-blur-md border-b border-white/20 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter text-blue-600 hover:opacity-90 transition">
          <BookOpen className="h-6 w-6" />
          <span>LMSTobi</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-x-8 text-sm font-semibold text-slate-700">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/courses" className="hover:text-blue-600 transition">Courses</Link>
          <Link href="/blog" className="hover:text-blue-600 transition">Blog</Link>
          <Link href="/about" className="hover:text-blue-600 transition">About</Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-x-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="font-bold text-slate-700 hover:text-blue-600">
                  Log In
                </Button>
              </SignInButton>

              {/* Modal Sign Up Kustom */}
              <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) setRole(null); }}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-200 transition-transform active:scale-95">
                    Sign Up
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] p-0 border-none bg-transparent shadow-none">
                  
                  {!role ? (
                    /* Langkah 1: Pilih Role */
                    <div className="bg-white p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
                      <DialogHeader className="mb-8">
                        <DialogTitle className="text-2xl font-bold text-center text-slate-900">Mulai Belajar atau Mengajar?</DialogTitle>
                        <p className="text-center text-slate-500 text-sm">Pilih peran Anda untuk menyesuaikan pengalaman belajar.</p>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setRole("student")}
                          className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                        >
                          <div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <User className="h-8 w-8" />
                          </div>
                          <span className="font-bold text-slate-700">Student</span>
                        </button>

                        <button 
                          onClick={() => setRole("instructor")}
                          className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                        >
                          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <GraduationCap className="h-8 w-8" />
                          </div>
                          <span className="font-bold text-slate-700">Instructor</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Langkah 2: SignUp Form */
                    <div className="relative animate-in slide-in-from-bottom-4 duration-500 bg-white rounded-3xl p-1">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setRole(null)}
                        className="absolute top-4 left-4 z-50 rounded-full h-8 w-8 p-0 bg-white/80 backdrop-blur-sm border shadow-sm"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="max-h-[85vh] overflow-y-auto rounded-3xl hide-scrollbar">
                        <SignUp 
                          routing="hash"
                          unsafeMetadata={{ role }}
                          afterSignUpUrl="/"
                          appearance={{
                            elements: {
                              rootBox: "mx-auto",
                              card: "shadow-none border-none rounded-3xl",
                              footer: "hidden", 
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex items-center gap-x-3">
              {/* Badge Role Visual */}
              <span className="hidden md:inline-block text-[10px] bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full uppercase font-bold tracking-tight border border-blue-200">
                {userRole}
              </span>
              
              {/* Menggunakan UserButtonCustom agar link Dashboard muncul di dropdown */}
              <UserButtonCustom role={userRole} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}