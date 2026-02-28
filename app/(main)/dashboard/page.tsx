"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";
import { 
  BookOpen, 
  PlayCircle, 
  Loader2,
  LayoutDashboard,
  Search,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const supabase = createClient();
  
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      // Pastikan user sudah terautentikasi oleh Clerk
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Debug: Pastikan User ID Clerk keluar di console
        console.log("Fetching for User ID:", user.id);

        const { data, error: supabaseError } = await supabase
          .from("enrollments")
          .select(`
            id,
            user_id,
            course_id,
            status,
            courses (
              id,
              title,
              image_url,
              category,
              description
            )
          `)
          .eq("user_id", user.id); // Filter berdasarkan ID user yang login

        if (supabaseError) throw supabaseError;

        console.log("Raw Data from Supabase:", data);

        // Mapping data agar state berisi array objek course
        // Kita juga memfilter agar yang muncul hanya jika data 'courses' tidak null
        const courses = data
          ?.filter((item: any) => item.courses !== null)
          .map((item: any) => ({
            ...item.courses,
            enrollmentStatus: item.status,
            enrollmentId: item.id
          })) || [];

        setEnrolledCourses(courses);
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchMyCourses();
    }
  }, [user, isLoaded, supabase]);

  // Filter pencarian berdasarkan judul kursus
  const filteredCourses = enrolledCourses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-sm font-medium text-slate-500">Memuat kursus Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Dashboard Saya
              </h1>
              <p className="text-slate-500 mt-1 font-medium">
                Halo, <span className="text-blue-600 font-bold">{user?.firstName || "Tobi"}</span>. Senang melihatmu kembali!
              </p>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Cari kursus di koleksi saya..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-slate-100 border-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 focus:ring-0 w-full md:w-80 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
            <AlertCircle size={20} />
            <span>Gagal memuat data: {error}</span>
          </div>
        )}

        {/* Stats & Label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
            <BookOpen size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Kursus Aktif</h2>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {enrolledCourses.length} Materi
          </span>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500"
              >
                {/* Thumbnail Section */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.image_url || "/placeholder-course.jpg"} 
                    alt={course.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <Link 
                      href={`/courses/${course.id}/learn`}
                      className="w-full bg-white text-slate-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl"
                    >
                      <PlayCircle size={18} className="text-blue-600" />
                      Lanjutkan Belajar
                    </Link>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-7">
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    {course.category || "General"}
                  </span>
                  
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mt-4 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                    {course.description || "Belum ada deskripsi untuk kursus ini."}
                  </p>
                  
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link 
                      href={`/courses/${course.id}/learn`}
                      className="text-blue-600 font-bold text-sm flex items-center gap-1 group/link"
                    >
                      Buka Materi
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    
                    <div className="flex items-center text-emerald-600 gap-1.5 text-[10px] font-black uppercase tracking-tighter">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Akses Selamanya
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State - Tobiproject Style */
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center max-w-2xl mx-auto mt-10">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <LayoutDashboard className="text-slate-300" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Belum Ada Kursus Terdaftar</h2>
            <p className="text-slate-500 mt-3 leading-relaxed">
              Koleksi kursus Anda masih kosong. Temukan materi berkualitas dari <strong>Tobiproject</strong> dan kembangkan karirmu sekarang.
            </p>
            <Link 
              href="/courses"
              className="inline-flex items-center gap-2 mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Cari Kursus
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}