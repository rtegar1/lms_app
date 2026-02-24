"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, X, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // Import createClient dari utils/supabase/client.ts
import { useUser, RedirectToSignIn } from "@clerk/nextjs"; // Import RedirectToSignIn
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [mustLogin, setMustLogin] = useState(false); // State untuk proteksi login

  const supabase = createClient();

  useEffect(() => {
    const fetchPublishedCourses = async () => {
      try {
        setLoading(true);
        // PERBAIKAN: Nama tabel harus "courses" sesuai skema Anda
        const { data, error } = await supabase
          .from("courses") 
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedCourses();
  }, []);

  const handleAccess = (course: any) => {
    if (!isSignedIn) {
      // PERBAIKAN: Set state untuk trigger redirect jika belum login
      setMustLogin(true);
      return;
    }
    router.push(`/courses/${course.id}/checkout`);
  };

  // Jika user klik beli tapi belum login, arahkan ke sign-in Clerk
  if (mustLogin) {
    return <RedirectToSignIn />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-28 py-12 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Jelajahi Kursus</h1>
        <p className="text-gray-600">Materi coding terupdate yang sudah dikurasi oleh Admin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              {course.image_url ? (
                <img src={course.image_url} alt={course.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs font-bold uppercase">No Preview</div>
              )}
            </div>

            <div className="p-5">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{course.category}</span>
              <h3 className="text-xl font-bold mb-4 text-gray-800 line-clamp-1">{course.title}</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-gray-900">
                  {course.price === 0 ? "Gratis" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(course.price)}
                </span>
                <button 
                  onClick={() => setSelectedCourse(course)}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10">
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-square md:aspect-auto bg-gray-100">
                <img src={selectedCourse.image_url} alt={selectedCourse.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 md:w-1/2 flex flex-col">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4 leading-tight">{selectedCourse.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{selectedCourse.description}</p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 font-medium">Total Harga</span>
                    <span className="text-2xl font-black text-gray-900">
                      {selectedCourse.price === 0 ? "Gratis" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(selectedCourse.price)}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleAccess(selectedCourse)}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    <ShoppingCart size={20} /> {isSignedIn ? "Daftar Sekarang" : "Login untuk Mengakses"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}