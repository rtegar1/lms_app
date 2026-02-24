"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Helper untuk generate ID jika crypto.randomUUID tidak tersedia (Secure Context)
const generateId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_option: number;
}

interface QuizFormProps {
  quizId: string;
  initialQuestions: Question[];
}

export default function QuizForm({ quizId, initialQuestions }: QuizFormProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const addQuestion = () => {
    const newQuestion = {
      id: generateId(),
      question_text: "",
      options: ["", "", "", ""],
      correct_option: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestionText = (index: number, text: string) => {
    const newQs = [...questions];
    newQs[index].question_text = text;
    setQuestions(newQs);
  };

  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    const newQs = [...questions];
    newQs[qIndex].options[oIndex] = text;
    setQuestions(newQs);
  };

  const removeQuestion = async (index: number, id: string) => {
    if (confirm("Hapus soal ini?")) {
      // Jika ID bukan format UUID (berarti soal baru belum di DB), langsung hapus dari state
      if (id.length < 20) {
        setQuestions(questions.filter((_, i) => i !== index));
        return;
      }

      const { error } = await supabase.from("questions").delete().eq("id", id);
      if (!error) {
        setQuestions(questions.filter((_, i) => i !== index));
        toast.success("Soal dihapus dari database");
      } else {
        toast.error("Gagal menghapus soal");
      }
    }
  };

  const handleSave = async () => {
    if (questions.length === 0) return toast.error("Minimal harus ada satu soal!");
    
    setLoading(true);
    try {
      // Validasi: Semua teks soal dan 4 pilihan harus diisi
      const isValid = questions.every(q => 
        q.question_text.trim() !== "" && 
        q.options.every(o => o.trim() !== "")
      );

      if (!isValid) {
        toast.error("Harap isi semua teks soal dan semua pilihan jawaban!");
        setLoading(false);
        return;
      }

      // Persiapkan data (menghapus ID sementara agar Supabase generate UUID asli)
      const dataToSave = questions.map((q) => ({
        quiz_id: quizId,
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
      }));

      // Eksekusi: Hapus data lama di quiz ini, lalu masukkan yang baru
      // Ini memastikan urutan dan integritas data tetap terjaga
      const { error: deleteError } = await supabase
        .from("questions")
        .delete()
        .eq("quiz_id", quizId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("questions")
        .insert(dataToSave);

      if (insertError) throw insertError;

      toast.success("Latihan soal berhasil diperbarui!");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error("Gagal menyimpan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qIndex) => (
        <div key={q.id} className="bg-white p-6 rounded-xl border-2 border-slate-100 shadow-sm relative group animate-in fade-in slide-in-from-bottom-2">
          <button 
            onClick={() => removeQuestion(qIndex, q.id)}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pertanyaan {qIndex + 1}
              </label>
              <textarea
                value={q.question_text}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                placeholder="Contoh: Apa fungsi dari tag <div> dalam HTML?"
                className="w-full mt-2 p-3 border-2 border-slate-100 rounded-lg focus:border-emerald-500 focus:ring-0 outline-none transition resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options.map((opt, oIndex) => (
                <div 
                  key={oIndex} 
                  className={`flex items-center gap-x-3 p-3 rounded-lg border-2 transition ${
                    q.correct_option === oIndex 
                    ? "border-emerald-500 bg-emerald-50" 
                    : "border-slate-50 hover:border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correct_option === oIndex}
                    onChange={() => {
                      const newQs = [...questions];
                      newQs[qIndex].correct_option = oIndex;
                      setQuestions(newQs);
                    }}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    placeholder={`Pilihan ${oIndex + 1}`}
                    className="flex-1 bg-transparent text-sm outline-none font-medium"
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">
              *Pilih salah satu bulatan untuk menentukan jawaban yang benar.
            </p>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-20">
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-x-2 px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition w-full sm:w-auto justify-center font-semibold"
        >
          <Plus className="h-5 w-5" />
          Tambah Pertanyaan
        </button>

        <button
          disabled={loading || questions.length === 0}
          onClick={handleSave}
          className="flex items-center gap-x-2 px-10 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition disabled:bg-slate-300 w-full sm:w-auto justify-center shadow-lg shadow-emerald-200 active:scale-95"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {loading ? "Menyimpan..." : "Simpan Semua Soal"}
        </button>
      </div>
    </div>
  );
}