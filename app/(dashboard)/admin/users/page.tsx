"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Proteksi Halaman: Pastikan hanya admin yang bisa akses
  useEffect(() => {
    async function checkAccess() {
      if (isLoaded && user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (data?.role !== 'admin') {
          router.push("/dashboard");
        }
      }
    }
    checkAccess();
  }, [isLoaded, user, router]);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name", { ascending: true });

    if (!error) {
      setProfiles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Fungsi untuk mengubah Role
  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      alert("Gagal mengubah role: " + error.message);
    } else {
      fetchProfiles();
    }
  };

  // FUNGSI BARU: Menghapus User
  const deleteUser = async (userId: string, userName: string) => {
    // Jangan izinkan admin menghapus dirinya sendiri
    if (userId === user?.id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri dari sini.");
      return;
    }

    const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus user "${userName}"? Tindakan ini tidak dapat dibatalkan.`);
    
    if (confirmDelete) {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        alert("Gagal menghapus user: " + error.message);
      } else {
        alert("User berhasil dihapus dari database.");
        fetchProfiles(); // Refresh daftar
      }
    }
  };

  if (!isLoaded) return <div className="p-8 text-center animate-pulse">Memuat...</div>;

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500">Kelola akses dan hapus data pengguna platform.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Nama</th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Email</th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Role</th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="p-12 text-center text-slate-400">Sedang mengambil data...</td></tr>
            ) : (
              profiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm font-semibold text-slate-700">{p.full_name}</td>
                  <td className="p-4 text-sm text-slate-600">{p.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.role === 'admin' ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10' : 
                      p.role === 'instructor' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10' : 
                      'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/10'
                    }`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end items-center gap-x-2">
                    <select 
                      className="text-xs border border-slate-200 rounded-lg p-1.5 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={p.role}
                      onChange={(e) => updateRole(p.id, e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>

                    {/* Tombol Hapus */}
                    <button 
                      onClick={() => deleteUser(p.id, p.full_name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition"
                      title="Hapus User"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}