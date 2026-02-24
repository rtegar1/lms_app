import { createClient } from '@/utils/supabase/server';
import ProfileForm from "./_components/profile-form";
import { auth } from "@clerk/nextjs/server"; // Gunakan Clerk Auth
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InstructorProfilePage() {
  // 1. Ambil ID User dari Clerk
  const { userId } = await auth();

  // Jika tidak ada session di Clerk, arahkan ke login
  if (!userId) {
    redirect("/sign-in"); // Sesuaikan dengan route login Clerk Anda
  }

  const supabase = await createClient();

  // 2. Ambil data detail profil dari Supabase berdasarkan ID Clerk
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      id, full_name, email,
      instructor_details (
        institution, phone_number, bio, 
        bank_name, account_number
      )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error("Supabase Error:", error.message);
  }

  // 3. Tangani data relasi (jika berbentuk array atau objek)
  const rawDetails = profile?.instructor_details;
  const details = Array.isArray(rawDetails) ? rawDetails[0] : rawDetails;

  // 4. Mapping data untuk form
  const initialData = {
    id: userId,
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    institution: details?.institution || "",
    phone_number: details?.phone_number || "",
    bio: details?.bio || "",
    bank_name: details?.bank_name || "",
    account_number: details?.account_number || "",
  };

  return (
  <div className="p-6 md:p-10 pt-10 bg-slate-50/50 min-h-screen">
    {/* Menggunakan max-w-4xl agar lebar konten konsisten dengan form */}
    <div className="max-w-4xl mx-auto">
      
      {/* Header Section dengan Spacing yang lebih lega */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
          Profil Saya
        </h1>
        <p className="text-slate-500 mt-3 font-medium text-sm md:text-base">
          Kelola informasi pribadi dan data pembayaran Anda.
        </p>
      </div>
      
      {/* Form Section */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProfileForm data={initialData} />
      </div>

    </div>
  </div>
);
}