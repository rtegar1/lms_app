"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createModule } from "@/lib/actions/module-actions";

interface ModuleFormProps {
  courseId: string;
}

export default function ModuleForm({ courseId }: ModuleFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      setLoading(true);
      await createModule(courseId, title);
      setTitle("");
      setIsCreating(false);
    } catch (error) {
      alert("Gagal menambahkan modul");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-50 rounded-xl p-4">
      <div className="flex items-center justify-between font-medium">
        Modul Kursus
        <Button onClick={toggleCreating} variant="ghost" size="sm">
          {isCreating ? "Batal" : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> Tambah Modul
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <input
            disabled={loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Dasar-dasar Next.js"
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            required
          />
          <Button disabled={loading || !title} type="submit" size="sm" className="bg-blue-600">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buat Modul"}
          </Button>
        </form>
      )}
    </div>
  );
}