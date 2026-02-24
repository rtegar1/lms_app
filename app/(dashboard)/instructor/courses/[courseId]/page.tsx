import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ListChecks, 
  Video, 
  Trash2, 
  ChevronRight,
  Globe,
  FileEdit
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ModuleForm from "@/components/instructor/ModuleForm";
import LessonForm from "@/components/instructor/LessonForm";
import EditCourseModal from "@/components/instructor/EditCourseModal";
import { deleteModule } from "@/lib/actions/module-actions";
import { togglePublishCourse } from "@/lib/actions/course-actions";

export default async function CourseSetupPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { userId } = await auth();
  const supabase = await createClient();

  if (!userId) return redirect("/");

  // 1. Ambil data kursus lengkap dengan status publikasi
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) return redirect("/instructor/courses");

  // 2. Ambil data modul beserta materi (lessons)
  const { data: modules } = await supabase
    .from("modules")
    .select(`
      *,
      lessons (*) 
    `)
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* HEADER SECTION - Fitur Publikasi Dinamis */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-4">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Setup Kursus</h1>
            <div className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm ${
              course.is_published 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-amber-100 text-amber-700 border border-amber-200"
            }`}>
              {course.is_published ? "● Live" : "○ Draft"}
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium italic">
            ID: <span className="text-slate-400 font-mono">{course.id}</span>
          </p>
        </div>

        <form action={async () => {
          "use server";
          await togglePublishCourse(courseId, !!course.is_published);
        }}>
          <Button 
            type="submit"
            className={`font-bold shadow-xl transition-all active:scale-95 px-8 rounded-2xl py-6 flex items-center gap-x-2 ${
              course.is_published 
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-100 text-white" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-100 text-white"
            }`}
          >
            <Globe size={18} />
            {course.is_published ? "BATAL PUBLIKASI" : "PUBLIKASIKAN KURSUS"}
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* KOLOM KIRI (2/5): DETAIL UTAMA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-x-2 p-4 bg-blue-50 rounded-2xl text-blue-700 font-bold">
            <LayoutDashboard size={20} />
            <h2>Detail Utama</h2>
          </div>
          
          <div className="p-8 border rounded-[2.5rem] bg-white shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <FileEdit size={80} />
            </div>

            <div className="space-y-2">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Judul Kursus</p>
               <p className="text-sm text-slate-700 font-bold leading-relaxed">{course.title}</p>
            </div>

            <div className="space-y-2">
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Harga Jual</p>
               <p className="text-2xl text-blue-600 font-black">
                 {course.price === 0 ? "GRATIS" : `Rp ${course.price?.toLocaleString("id-ID")}`}
               </p>
            </div>
            
            <EditCourseModal initialData={course} />
          </div>
        </div>

        {/* KOLOM KANAN (3/5): KURIKULUM */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-x-2 p-4 bg-purple-50 rounded-2xl text-purple-700 font-bold">
            <ListChecks size={20} />
            <h2>Kurikulum Pembelajaran</h2>
          </div>

          <ModuleForm courseId={courseId} />

          <div className="space-y-6">
            {!modules || modules.length === 0 ? (
              <div className="text-center p-16 border-2 border-dashed rounded-[2.5rem] bg-slate-50/50">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Belum ada modul kursus</p>
              </div>
            ) : (
              modules.map((module, index) => (
                <div key={module.id} className="p-6 border rounded-[2.5rem] bg-white shadow-sm border-slate-100 transition hover:shadow-md">
                  {/* Header Modul */}
                  <div className="flex items-center justify-between mb-6 gap-x-4">
                    <div className="flex items-center gap-x-3 flex-1 min-w-0">
                      <div className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-lg font-black tracking-tighter">
                        MODUL {index + 1}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm truncate uppercase tracking-tight">
                        {module.title}
                      </h3>
                    </div>

                    <form action={async () => {
                      "use server";
                      await deleteModule(courseId, module.id);
                    }}>
                      <Button 
                        type="submit"
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-300 hover:text-red-600 transition p-2 h-auto rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </form>
                  </div>

                  {/* DAFTAR MATERI */}
                  <div className="space-y-3 mb-6">
                    {module.lessons && module.lessons.length > 0 ? (
                      module.lessons.map((lesson: any) => (
                        <div 
                          key={lesson.id} 
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/lesson hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100 shadow-sm"
                        >
                          <div className="flex items-center gap-x-4">
                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                              <Video size={16} className="text-slate-400 group-hover/lesson:text-blue-500" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 group-hover/lesson:text-blue-700">
                              {lesson.title}
                            </span>
                          </div>
                          
                          <Link href={`/instructor/courses/${courseId}/lessons/${lesson.id}`}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 text-[10px] font-black text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl px-4 transition-all"
                            >
                              EDIT <ChevronRight size={14} className="ml-1" />
                            </Button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 border-2 border-dotted rounded-2xl bg-slate-50/30">
                        <p className="text-[10px] text-slate-300 font-black text-center uppercase tracking-[0.2em]">Kosong</p>
                      </div>
                    )}
                  </div>

                  <LessonForm moduleId={module.id} courseId={courseId} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}