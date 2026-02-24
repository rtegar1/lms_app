"use client";

import { useState } from "react";
import { updateStudentProfile } from "@/lib/actions/student-actions";
import { Eye, Pencil, Trash2, X, Search, Download, Save, User } from "lucide-react";

export default function StudentTable({ data }: { data: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStudent, setViewStudent] = useState<any>(null);
  const [editStudent, setEditStudent] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const filteredData = data.filter((student) =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.institution?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ["Nama", "Email", "Institusi", "WhatsApp", "Poin"];
    const rows = filteredData.map(s => [
      `"${s.full_name}"`, `"${s.email}"`, `"${s.institution || "-"}"`, 
      `"${s.phone_number || "-"}"`, s.points || 0
    ].join(","));
    
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `daftar_siswa_${new Date().toLocaleDateString('id-ID')}.csv`;
    link.click();
  };

  const handleEditOpen = (student: any) => {
    setEditStudent(student);
    setFormData({
      full_name: student.full_name || "",
      email: student.email || "",
      bio: student.bio || "",
      phone_number: student.phone_number || "",
      institution: student.institution || ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStudentProfile(editStudent.id, formData);
      setEditStudent(null);
      alert("Data siswa berhasil diperbarui!");
    } catch (error) {
      alert("Gagal memperbarui data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Daftar Siswa</h1>
          <p className="text-sm text-slate-500 font-medium">Total {filteredData.length} siswa ditemukan.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={18} />
            <span className="hidden md:block">Export CSV</span>
          </button>
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Cari nama atau email..."
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Siswa</th>
                <th className="px-6 py-5">Kontak & Institusi</th>
                <th className="px-6 py-5 text-center">Poin</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-100 uppercase">
                        {student.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{student.full_name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-slate-600 font-bold">{student.institution || "-"}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{student.phone_number || "-"}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-tighter">
                      {student.points || 0} XP
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setViewStudent(student)} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"><Eye size={18} /></button>
                      <button onClick={() => handleEditOpen(student)} className="p-2.5 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"><Pencil size={18} /></button>
                      <button className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL VIEW */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 pb-4 flex justify-between items-start">
              <div className="h-20 w-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600">
                <User size={40} />
              </div>
              <button onClick={() => setViewStudent(null)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 pt-0 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewStudent.full_name}</h3>
                <p className="text-sm text-slate-400">{viewStudent.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Institusi</p>
                  <p className="text-sm text-slate-700 font-bold">{viewStudent.institution || "-"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] text-slate-400 uppercase font-black mb-1">WhatsApp</p>
                  <p className="text-sm text-slate-700 font-bold">{viewStudent.phone_number || "-"}</p>
                </div>
                <div className="col-span-2 p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Bio</p>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    "{viewStudent.bio || "Siswa ini belum menuliskan bio."}"
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 pt-0">
               <button onClick={() => setViewStudent(null)} className="w-full py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Edit Profil Siswa</h3>
                <p className="text-xs text-slate-400 mt-1">Perbarui informasi dasar siswa.</p>
              </div>
              <button type="button" onClick={() => setEditStudent(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Nama Lengkap</label>
                <input 
                  required
                  className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  value={formData.full_name} 
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">Institusi</label>
                  <input 
                    className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.institution} 
                    onChange={(e) => setFormData({...formData, institution: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 ml-1">No. WhatsApp</label>
                  <input 
                    className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.phone_number} 
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">Bio</label>
                <textarea 
                  rows={3}
                  className="w-full px-5 py-3 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                />
              </div>
            </div>
            <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => setEditStudent(null)} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all">Batal</button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}