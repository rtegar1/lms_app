"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase/client";
import { 
  PlayCircle, 
  ChevronLeft, 
  Loader2,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Trophy,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";

export default function LearnPage() {
  const { courseId } = useParams();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"materi" | "latihan">("materi");
  
  // State untuk Quiz
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLearningData = async () => {
      if (!isLoaded || !user || !courseId) return;

      try {
        setLoading(true);

        // 1. Proteksi Akses: Cek Enrollment
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("course_id", courseId)
          .eq("user_id", user.id)
          .single();

        if (!enrollment) {
          toast.error("Akses tidak ditemukan");
          router.push(`/courses/${courseId}`);
          return;
        }

        // 2. Query Nested Berdasarkan Skema Database
        // Courses -> Modules -> Lessons -> Quizzes -> Questions
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select(`
            title,
            modules (
              id, title, position,
              lessons (
                id, title, video_url, content, position,
                quizzes (
                  id, title,
                  questions (
                    id, question_text, options, correct_option
                  )
                )
              )
            )
          `)
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;

        if (courseData) {
          setCourse(courseData);
          const sortedModules = courseData.modules.sort((a: any, b: any) => a.position - b.position);
          setModules(sortedModules);
          
          if (sortedModules.length > 0 && sortedModules[0].lessons.length > 0) {
            const firstLesson = sortedModules[0].lessons.sort((a: any, b: any) => a.position - b.position)[0];
            setCurrentLesson(firstLesson);
          }
        }
      } catch (error: any) {
        console.error("Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId, user, isLoaded, supabase, router]);

  // Reset state saat pindah lesson
  useEffect(() => {
    setSelectedAnswers({});
    setActiveTab("materi");
  }, [currentLesson]);

  const handleSelectAnswer = (questionId: string, optionKey: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  if (loading || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-black tracking-tighter uppercase">Menyiapkan Kurikulum Tobiproject...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header Navigation */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all group">
            <ChevronLeft size={20} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5">LMS Academy</p>
            <h1 className="font-bold text-slate-900 text-sm md:text-base italic line-clamp-1">{course?.title}</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-10">
            
            {/* Player Video */}
            <div className="aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
              {currentLesson?.video_url ? (
                <iframe src={currentLesson.video_url} className="w-full h-full" allowFullScreen />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <PlayCircle size={64} className="mb-4 opacity-10" />
                  <p className="font-black text-xs uppercase tracking-widest">Video Tidak Tersedia</p>
                </div>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 p-2 bg-white rounded-3xl border border-slate-100 w-fit">
              <button 
                onClick={() => setActiveTab("materi")}
                className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'materi' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <BookOpen size={16} /> Materi
              </button>
              <button 
                onClick={() => setActiveTab("latihan")}
                className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'latihan' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <HelpCircle size={16} /> Latihan
              </button>
            </div>

            {/* Content Container */}
            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 min-h-[500px]">
              {activeTab === "materi" ? (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8 underline decoration-blue-600 decoration-4 underline-offset-8">
                    {currentLesson?.title}
                  </h2>
                  <div className="prose prose-blue max-w-none text-slate-600 leading-relaxed font-medium">
                    {currentLesson?.content || "Belum ada deskripsi materi."}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-10">Uji Kemampuan</h2>
                  {currentLesson?.quizzes?.length > 0 ? (
                    currentLesson.quizzes.map((quiz: any) => (
                      <div key={quiz.id} className="space-y-12">
                        {quiz.questions.map((q: any, i: number) => (
                          <div key={q.id} className="space-y-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <p className="font-bold text-slate-800 text-xl leading-snug">
                              <span className="text-blue-600 mr-2 italic">#{i + 1}</span> {q.question_text}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {Object.entries(q.options || {}).map(([key, value]: any, idx) => {
                                const label = String.fromCharCode(65 + idx); // A, B, C, D
                                const isSelected = selectedAnswers[q.id] === key;
                                const isCorrect = key === q.correct_option;
                                
                                let buttonClass = "bg-white border-2 border-slate-100 text-slate-600";
                                if (isSelected) {
                                  buttonClass = isCorrect 
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100" 
                                    : "border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-100";
                                }

                                return (
                                  <button 
                                    key={key} 
                                    onClick={() => handleSelectAnswer(q.id, key)}
                                    className={`p-6 text-left rounded-[1.5rem] transition-all font-bold text-sm flex items-center group relative overflow-hidden ${buttonClass}`}
                                  >
                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-black transition-colors ${isSelected ? 'bg-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                      {label}
                                    </span>
                                    <span className="flex-1">{value}</span>
                                    {isSelected && (
                                      isCorrect ? <CheckCircle className="text-emerald-500 ml-2" size={20} /> : <XCircle className="text-red-500 ml-2" size={20} />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-slate-400 border-4 border-dashed border-slate-50 rounded-[3rem]">
                      <Trophy size={64} className="mx-auto mb-6 opacity-10" />
                      <p className="font-black italic uppercase tracking-widest">Latihan Soal Segera Datang!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar Curriculum */}
        <aside className="w-[420px] border-l border-slate-200 bg-white hidden lg:flex flex-col shrink-0">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.4em]">Kurikulum Kursus</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
            {modules.map((module) => (
              <div key={module.id} className="space-y-4">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2 bg-blue-50 w-fit py-1 rounded-md">{module.title}</h4>
                <div className="space-y-2">
                  {module.lessons.sort((a: any, b: any) => a.position - b.position).map((lesson: any) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full flex items-center gap-4 p-5 rounded-[1.75rem] transition-all text-left group ${currentLesson?.id === lesson.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${currentLesson?.id === lesson.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                        {lesson.position}
                      </div>
                      <p className="text-xs font-bold leading-tight flex-1">{lesson.title}</p>
                      {currentLesson?.id === lesson.id && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}