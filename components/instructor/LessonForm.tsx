"use client";

import { useState } from "react";
import { Plus, Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createLesson } from "@/lib/actions/lesson-actions";

interface LessonFormProps {
  moduleId: string;
  courseId: string;
}

export default function LessonForm({ moduleId, courseId }: LessonFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      setLoading(true);
      await createLesson(moduleId, courseId, title);
      setTitle("");
      setIsCreating(false);
    } catch (error) {
      alert("Gagal menambahkan materi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pl-8 border-l-2 border-slate-200">
      {isCreating ? (
        <form onSubmit={onSubmit} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-dashed">
          <div className="flex items-center gap-x-2">
            <Video size={16} className="text-slate-500" />
            <input
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul Materi (Contoh: Cara Install Next.js)"
              className="flex-1 p-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-x-2">
            <Button disabled={loading || !title} type="submit" size="sm" className="h-8 bg-blue-600">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Materi"}
            </Button>
            <Button onClick={() => setIsCreating(false)} variant="ghost" size="sm" className="h-8">
              Batal
            </Button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-x-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <Plus size={14} /> TAMBAH VIDEO/TEKS
        </button>
      )}
    </div>
  );
}