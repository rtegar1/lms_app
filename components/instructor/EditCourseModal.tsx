"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Loader2, X, CircleDollarSign, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCourse } from "@/lib/actions/course-actions"; // Pastikan fungsi updateCourse sudah digabung di course-actions.ts

interface EditCourseModalProps {
  initialData: {
    id: string;
    title: string;
    price: number;
  };
}

export default function EditCourseModal({ initialData }: EditCourseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(initialData.title);
  const [price, setPrice] = useState(initialData.price);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSave = async () => {
    try {
      setLoading(true);
      
      // Memanggil fungsi update yang sudah digabung di course-actions
      await updateCourse(initialData.id, { 
        title, 
        price: Number(price) 
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      alert("Terjadi kesalahan saat memperbarui detail kursus.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        className="w-full text-xs font-bold border-slate-200 hover:bg-slate-50 rounded-xl py-6 transition-all group"
      >
        <Edit className="h-4 w-4 mr-2 text-slate-400 group-hover:text-blue-600" />
        EDIT DETAIL KURSUS
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-x-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Edit size={16} />
            </div>
            <h3 className="font-bold text-slate-800">Edit Info Utama</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form Body */}
        <div className="p-8 space-y-6">
          {/* Input Judul */}
          <div className="space-y-2">
            <div className="flex items-center gap-x-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">
              <Type size={12} />
              <label>Judul Kursus</label>
            </div>
            <input 
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul kursus..."
              className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-semibold transition-all"
            />
          </div>

          {/* Input Harga */}
          <div className="space-y-2">
            <div className="flex items-center gap-x-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">
              <CircleDollarSign size={12} />
              <label>Harga Kursus (Rp)</label>
            </div>
            <input 
              disabled={loading}
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="0 (Gratis)"
              className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm font-bold text-blue-600 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col gap-y-3">
            <Button 
              onClick={onSave}
              disabled={loading || !title}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-7 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                "SIMPAN PERUBAHAN"
              )}
            </Button>
            <Button 
              disabled={loading}
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="w-full text-slate-400 font-bold text-xs"
            >
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}