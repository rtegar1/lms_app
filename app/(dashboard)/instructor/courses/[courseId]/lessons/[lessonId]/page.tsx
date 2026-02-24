import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Video, AlignLeft, BrainCircuit, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import LessonVideoUpload from "@/components/instructor/LessonVideoUpload";
import LessonDescriptionForm from "@/components/instructor/LessonDescriptionForm";

export default async function LessonIdPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const { userId } = await auth();
  const supabase = await createClient();

  if (!userId) return redirect("/");

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) return redirect(`/instructor/courses/${courseId}`);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex flex-col gap-y-2">
          <Link
            href={`/instructor/courses/${courseId}`}
            className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Materi
          </Link>
          <div className="flex items-center gap-x-2 mt-2">
            <div className="p-2 bg-blue-100 rounded-md text-blue-700">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Setup Materi: <span className="text-blue-600">{lesson.title}</span>
            </h1>
          </div>
          <p className="text-sm text-slate-500 ml-10">
            Lengkapi detail video, deskripsi, dan latihan soal untuk materi ini.
          </p>
        </div>

        {/* Action Button: Kelola Kuis */}
        <Link href={`/instructor/courses/${courseId}/lessons/${lessonId}/quiz`}>
          <button className="flex items-center justify-center gap-x-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-md shadow-slate-200 active:scale-95 w-full md:w-auto">
            <BrainCircuit className="h-5 w-5 text-emerald-400" />
            Kelola Latihan Soal
          </button>
        </Link>
      </div>

      <hr className="mb-8 border-slate-200" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sisi Kiri: Video Materi */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-3 p-4 bg-white border border-slate-200 rounded-t-xl border-b-0 shadow-sm">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Konten Video</h2>
              <p className="text-xs text-slate-500">Gunakan link YouTube Unlisted</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-b-xl p-6 shadow-sm mt-[-24px]">
            <LessonVideoUpload 
              courseId={courseId} 
              lessonId={lessonId} 
              initialData={lesson} 
            />
          </div>
        </div>

        {/* Sisi Kanan: Deskripsi */}
        <div className="space-y-6">
          <div className="flex items-center gap-x-3 p-4 bg-white border border-slate-200 rounded-t-xl border-b-0 shadow-sm">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <AlignLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Detail Penjelasan</h2>
              <p className="text-xs text-slate-500">Tuliskan ringkasan isi materi</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-b-xl p-6 shadow-sm mt-[-24px]">
            <LessonDescriptionForm 
              initialData={lesson}
              courseId={courseId}
              lessonId={lessonId}
            />
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-12 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-x-3">
        <div className="text-amber-600">💡</div>
        <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Tips:</strong> Pastikan video Anda sudah diatur sebagai <strong>Unlisted</strong> di YouTube Studio agar tidak muncul di pencarian publik tetapi tetap bisa diakses oleh siswa Anda di <strong>LMS Pro</strong>.
        </p>
      </div>
    </div>
  );
}