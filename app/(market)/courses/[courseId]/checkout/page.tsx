"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { 
  CreditCard, 
  ChevronLeft, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Lock
} from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { courseId } = useParams();
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Ambil data kursus berdasarkan ID dari URL
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();

        if (error) throw error;
        if (!data) {
          toast.error("Kursus tidak ditemukan");
          return router.push("/courses");
        }
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Gagal memuat detail kursus");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchCourse();
    }
  }, [courseId, isLoaded, router, supabase]);

  // 2. Proteksi Halaman: Jika tidak login, lempar ke sign-in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // 3. Logic Checkout (Memanggil API Route yang kita buat)
  const handleCheckout = async () => {
    if (!course) return;
    
    setIsProcessing(true);
    try {
      // Ganti bagian fetch Anda dengan ini untuk melihat error detail
const response = await fetch("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    courseId: course.id, // Pastikan ini UUID
    price: course.price,
  }),
});

if (!response.ok) {
  const errorData = await response.json();
  // INI PENTING: Lihat pesan error dari database di console
  console.log("Detail Error dari Database:", errorData.error); 
  toast.error(`Gagal: ${errorData.error || "Cek koneksi database"}`);
  return;
}

      toast.success("Pendaftaran berhasil dicatat!");

      // Delay simulasi sebelum pindah ke success page atau integrasi Midtrans
      setTimeout(() => {
        router.push(`/courses/${courseId}/success`);
      }, 1000);

    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(course?.price || 0);

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-slate-500 hover:text-slate-800 transition mb-8 group font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Detail
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-x-3 mb-8">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Metode Pembayaran</h2>
                  <p className="text-sm text-slate-500">Pilih cara pembayaran yang Anda inginkan</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Active Payment Option */}
                <div className="p-5 border-2 border-blue-600 bg-blue-50/50 rounded-2xl flex items-center justify-between cursor-pointer transition">
                  <div className="flex items-center gap-x-4">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600 border border-blue-100">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Pembayaran Instan</p>
                      <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">QRIS / Transfer Bank / E-Wallet</p>
                    </div>
                  </div>
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <CheckCircle2 className="text-white h-4 w-4" />
                  </div>
                </div>
                
                {/* Disabled Payment Option */}
                <div className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between opacity-50 grayscale cursor-not-allowed">
                  <div className="flex items-center gap-x-4">
                    <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-400">Kartu Kredit</p>
                      <p className="text-xs text-slate-400 font-medium italic">Belum tersedia</p>
                    </div>
                  </div>
                  <Lock className="text-slate-300 h-5 w-5" />
                </div>
              </div>

              <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex gap-x-3">
                <ShieldCheck className="text-emerald-500 h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kami menjamin keamanan transaksi Anda. Data pribadi Anda akan digunakan untuk memproses pendaftaran sesuai dengan Kebijakan Privasi <strong>Tobiproject</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-32">
              <h3 className="font-bold text-lg text-slate-900 mb-6">Ringkasan Pesanan</h3>
              
              <div className="flex gap-x-4 mb-8">
                <div className="relative h-20 w-20 shrink-0">
                  <img 
                    src={course?.image_url || "/placeholder.jpg"} 
                    className="w-full h-full object-cover rounded-2xl shadow-sm border border-slate-100"
                    alt="Thumbnail" 
                  />
                </div>
                <div className="flex flex-col justify-center gap-y-1">
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit uppercase tracking-tighter">
                    {course?.category}
                  </span>
                  <p className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug">
                    {course?.title}
                  </p>
                </div>
              </div>

              <div className="space-y-4 py-6 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Harga Dasar</span>
                  <span className="font-bold text-slate-800">{formattedPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">PPN (0%)</span>
                  <span className="font-bold text-emerald-600">Rp 0</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-slate-100 mb-8">
                <span className="font-bold text-slate-900 text-lg tracking-tight">Total Bayar</span>
                <span className="text-2xl font-black text-blue-600 font-mono tracking-tighter">
                  {formattedPrice}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.25rem] font-bold flex items-center justify-center gap-x-2 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Bayar Sekarang</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              

              <div className="flex items-center justify-center gap-x-2 mt-8 text-slate-400">
                <div className="h-px w-8 bg-slate-100" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout</span>
                <div className="h-px w-8 bg-slate-100" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}