"use client";

import { useState } from "react";
import { Save, User as UserIcon } from "lucide-react";
import { updateInstructorProfile } from "@/lib/actions/instructor-actions";

export default function ProfileForm({ data }: { data: any }) {
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Menggunakan Server Action yang sudah kita buat sebelumnya
      await updateInstructorProfile(data.id, formData);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* CARD 1: INFORMASI PROFIL */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6 mb-10">
          <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg uppercase">
            {formData.full_name ? formData.full_name.charAt(0) : "U"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Identitas Instruktur</h3>
            <p className="text-sm text-slate-400 mt-1">Data ini akan ditampilkan pada profil publik kursus Anda.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Nama Lengkap</label>
            <input 
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Email (Read-only)</label>
            <input 
              className="w-full px-5 py-4 border border-slate-100 bg-slate-50 rounded-2xl text-sm text-slate-400 outline-none cursor-not-allowed font-medium"
              value={formData.email}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Institusi</label>
            <input 
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">No. WhatsApp</label>
            <input 
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.phone_number}
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Bio Singkat</label>
            <textarea 
              rows={4}
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Ceritakan pengalaman profesional Anda..."
            />
          </div>
        </div>
      </div>

      {/* CARD 2: INFORMASI PEMBAYARAN */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="h-2 w-6 bg-emerald-500 rounded-full" />
          Data Pembayaran
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Nama Bank</label>
            <input 
              placeholder="Contoh: BCA, Mandiri, BNI"
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.bank_name}
              onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">Nomor Rekening</label>
            <input 
              placeholder="000-000-000"
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={formData.account_number}
              onChange={(e) => setFormData({...formData, account_number: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <button 
          type="submit"
          disabled={loading}
          className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
             <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             <Save size={20} />
          )}
          {loading ? "Menyimpan..." : "Simpan Perubahan Profil"}
        </button>
      </div>
    </form>
  );
}