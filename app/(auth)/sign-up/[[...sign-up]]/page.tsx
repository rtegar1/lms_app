"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();
  // Ambil role dari URL, default ke student
  const role = searchParams.get("role") === "instructor" ? "instructor" : "student";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 py-10">
      {/* Tab Pemilihan Role */}
      <div className="flex p-1 bg-slate-200 rounded-xl mb-8 w-full max-w-[400px]">
        <Link 
          href="/sign-up?role=student" 
          className={`flex-1 text-center py-2 rounded-lg text-sm font-bold transition-all ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Student
        </Link>
        <Link 
          href="/sign-up?role=instructor" 
          className={`flex-1 text-center py-2 rounded-lg text-sm font-bold transition-all ${role === 'instructor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Instructor
        </Link>
      </div>

      {/* Form Clerk */}
      <SignUp 
        appearance={{
          elements: {
            footer: "hidden", // Sembunyikan branding Clerk
            card: "shadow-xl border border-slate-200 rounded-2xl",
          }
        }}
        // Kirim role terpilih ke Webhook
        unsafeMetadata={{
          role: role
        }}
      />
    </div>
  );
}