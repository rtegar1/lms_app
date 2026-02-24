"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateLesson } from "@/lib/actions/lesson-actions";

// Import CSS Quill
import "react-quill-new/dist/quill.snow.css";

export default function LessonDescriptionForm({ 
  initialData, 
  courseId, 
  lessonId 
}: {
  initialData: { description: string | null };
  courseId: string;
  lessonId: string;
}) {
  const [value, setValue] = useState(initialData.description || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Import ReactQuill secara dinamis untuk mencegah error "window is not defined"
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill-new"), { 
    ssr: false,
    loading: () => (
      <div className="h-[250px] w-full bg-slate-50 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-sm">
        Memuat Editor Materi...
      </div>
    )
  }), []);

  // Konfigurasi Toolbar
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await updateLesson(courseId, lessonId, { description: value });
      alert("Materi berhasil disimpan!");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan deskripsi. Pastikan koneksi stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  const isInvalid = !value || value === "<p><br></p>" || value === initialData.description;

  return (
    <div className="p-6 bg-white border rounded-3xl shadow-sm space-y-4">
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          placeholder="Tuliskan materi pelajaran secara mendetail di sini..."
          className="min-h-[250px] text-slate-700"
        />
      </div>

      <div className="flex flex-col gap-y-3">
        <Button
          disabled={isLoading || isInvalid}
          onClick={onSubmit}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-6 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          SIMPAN PERUBAHAN MATERI
        </Button>
        
        {value === initialData.description && !isLoading && (
          <div className="flex items-center gap-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle size={12} />
            Tidak ada perubahan untuk disimpan
          </div>
        )}
      </div>
    </div>
  );
}