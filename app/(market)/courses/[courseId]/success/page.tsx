"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  CheckCircle, 
  PlayCircle, 
  ArrowRight, 
  Download, 
  Share2,
  Loader2,
  Home
} from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti"; // Opsional: install 'react-confetti' untuk efek perayaan

export default function SuccessPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const supabase = createClient();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Untuk efek confetti
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const fetchCourse = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("title, image_url")
          .eq("id", courseId)
          .single();

        if (error) throw error;
        setCourse(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-12 flex flex-col items-center justify-center px-4">
      {/* Efek Perayaan */}
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />

      <div className="max-w-2xl w-full text-center">
        {/* Icon Success */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-200 blur-2xl opacity-50 rounded-full animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-100 border border-emerald-50">
              <CheckCircle className="text-emerald-500 w-16 h-16" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          Pembayaran Berhasil!
        </h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          Selamat! Anda telah resmi terdaftar di kursus <br />
          <span className="font-bold text-slate-800">"{course?.title}"</span>. <br />
          Akses materi Anda sekarang dan mulai belajar.
        </p>

        {/* Course Card Preview */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4 mb-10 text-left">
          <img 
            src={course?.image_url || "/placeholder.jpg"} 
            alt="Course" 
            className="w-20 h-20 rounded-2xl object-cover shadow-sm"
          />
          <div>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Terdaftar</p>
            <h3 className="font-bold text-slate-800 leading-tight line-clamp-1">{course?.title}</h3>
            <p className="text-xs text-slate-400 mt-1">Akses Seumur Hidup • Sertifikat Digital</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href={`/courses/${courseId}/learn`}
            className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
          >
            <PlayCircle size={20} />
            Mulai Belajar
          </Link>
          <Link 
            href="/dashboard"
            className="flex items-center justify-center gap-x-2 bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <Home size={20} />
            Ke Dashboard
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap justify-center gap-8">
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition">
            <Download size={18} />
            Unduh Invoice
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition">
            <Share2 size={18} />
            Bagikan ke Teman
          </button>
        </div>
      </div>
    </div>
  );
}