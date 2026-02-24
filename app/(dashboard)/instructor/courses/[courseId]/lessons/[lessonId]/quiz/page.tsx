import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import Link from "next/link";
import QuizForm from "@/components/instructor/QuizForm";

export default async function LessonQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const { userId } = await auth();
  const supabase = await createClient();

  if (!userId) return redirect("/");

  // 1. Ambil data lesson untuk verifikasi
  const { data: lesson } = await supabase
    .from("lessons")
    .select("title")
    .eq("id", lessonId)
    .single();

  if (!lesson) return redirect(`/instructor/courses/${courseId}`);

  // 2. Ambil data quiz (jika sudah ada) atau buat jika belum ada
  let { data: quiz } = await supabase
    .from("quizzes")
    .select("*")
    .eq("lesson_id", lessonId)
    .single();

  if (!quiz) {
    const { data: newQuiz } = await supabase
      .from("quizzes")
      .insert({ lesson_id: lessonId, title: `Latihan: ${lesson.title}` })
      .select()
      .single();
    quiz = newQuiz;
  }

  // 3. Ambil daftar soal
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quiz?.id)
    .order("created_at", { ascending: true });

  return (
    <div className="p-6">
      <Link
        href={`/instructor/courses/${courseId}/lessons/${lessonId}`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Detail Materi
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold text-slate-800">Latihan Soal</h1>
          <span className="text-sm text-slate-500">Materi: {lesson.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-x-2 mb-6 p-4 bg-emerald-50 rounded-lg text-emerald-700 font-bold border border-emerald-200">
          <BrainCircuit className="h-6 w-6" />
          <h2>Kelola Pertanyaan (Pilihan Ganda)</h2>
        </div>

        <QuizForm 
          quizId={quiz?.id} 
          initialQuestions={questions || []} 
        />
      </div>
    </div>
  );
}