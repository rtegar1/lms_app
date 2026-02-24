import { SignIn } from "@clerk/nextjs";
import { BookOpen } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* --- SISI KIRI: BRANDING & VISUAL (Hidden on Mobile) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 items-center justify-center p-12 overflow-hidden">
        {/* Dekorasi Abstract (Mirip Landing Page) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full -ml-48 -mb-48 opacity-50" />
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-white p-2 rounded-xl">
              <BookOpen className="text-blue-600 h-8 w-8" />
            </div>
            <span className="text-2xl font-bold tracking-tight">LMS Master</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Tingkatkan Skill Anda ke Level Berikutnya.
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Akses ratusan kursus premium dan bergabunglah dengan komunitas pembelajar terbesar di Indonesia.
          </p>

          {/* Mockup Preview (Mirip di Image) */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800" 
              alt="Platform Preview" 
              className="relative rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      </div>

      {/* --- SISI KANAN: FORM SIGN IN --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-slate-50/30">
        <div className="w-full max-w-[400px]">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full shadow-none",
                card: "bg-transparent shadow-none p-0 w-full",
                headerTitle: "text-3xl font-extrabold text-slate-900 tracking-tight",
                headerSubtitle: "text-slate-500 text-base mt-2",
                socialButtonsBlockButton: "rounded-2xl border-slate-200 h-12 hover:bg-white transition-all shadow-sm",
                socialButtonsBlockButtonText: "font-semibold text-slate-700",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm font-bold py-6 rounded-2xl shadow-lg shadow-blue-100 transition-all mt-4",
                formFieldLabel: "text-slate-700 font-semibold mb-1",
                formFieldInput: "rounded-xl border-slate-200 focus:ring-blue-600 focus:border-blue-600 h-12 bg-white",
                footer: "hidden", 
                dividerRow: "my-6",
                dividerText: "text-slate-400 text-xs font-bold uppercase tracking-widest",
                formResendCodeLink: "text-blue-600 font-bold",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-bold text-sm",
                identityPreviewText: "text-slate-600",
                identityPreviewEditButtonIcon: "text-blue-600"
              },
              layout: {
                socialButtonsPlacement: "bottom", // Menaruh Google login di bawah seperti referensi
                shimmer: true
              }
            }}
          />
          
          {/* Footer Hak Cipta (Mirip di Image) */}
          <p className="text-center text-slate-400 text-sm mt-12">
            © 2026 LMS Master. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}