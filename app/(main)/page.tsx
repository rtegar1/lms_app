import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, BookOpen, Clock, ArrowRight } from "lucide-react";

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-bold text-slate-900">{number}</p>
      <p className="text-slate-500">{label}</p>
    </div>
  );
}

export default async function Home() {
  const { userId } = await auth();
  const supabase = await createClient();

  // 1. Ambil Statistik Dinamis
  const { count: totalCourses } = await supabase
    .from("courses")
    .select("*", { count: 'exact', head: true })
    .eq("is_published", true);

  const { count: totalStudents } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })
    .eq("role", "student");

  const { count: totalMentors } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })
    .eq("role", "instructor");

  // 2. Ambil 3 Kursus Terbaru yang sudah di-publish
  const { data: recentCourses } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
                We Offer Hundreds Of <br /> Courses To Choose From
              </h1>
              <p className="text-lg text-slate-500 max-w-lg">
                Explore your passions and develop new skills with our expert-led courses designed for your career growth.
              </p>
              
              <div className="flex gap-12 pt-4">
                <StatItem number={`${totalStudents || 0}`} label="Students" />
                <StatItem number={`${totalCourses || 0}+`} label="Courses" />
                <StatItem number={`${totalMentors || 0}`} label="Mentors" />
              </div>
            </div>
            
            <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000">
               <div className="absolute inset-0 bg-blue-200/30 rounded-[5rem] rotate-6 scale-95 blur-2xl"></div>
               <div className="relative bg-white p-6 rounded-[3rem] shadow-2xl border border-slate-100">
                  <div className="aspect-video bg-slate-100 rounded-[2rem] flex items-center justify-center overflow-hidden">
                    {/* Foto Hero tetap ada */}
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800" 
                      alt="Students" 
                      className="object-cover w-full h-full opacity-90" 
                    />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- RECENT COURSES SECTION --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Recent Approved Courses</h2>
              <p className="text-slate-500 mt-2">Pick your best course and start learning.</p>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentCourses?.map((course) => (
              <Card key={course.id} className="group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-300 rounded-3xl ring-1 ring-slate-100">
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white/90 text-blue-600 backdrop-blur-sm hover:bg-white capitalize tracking-wide font-bold">
                      {course.category}
                    </Badge>
                  </div>
                  {/* FOTO KURSUS DINAMIS: Menggunakan image_url dari database */}
                  {course.image_url ? (
                    <img 
                      src={course.image_url} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600/10 flex items-center justify-center text-blue-300 font-bold uppercase text-xs">
                      No Course Image
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-1">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-1"><Users className="h-4 w-4" /> Siswa Aktif</div>
                    <div className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> 12 Modules</div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center border-t bg-slate-50/50 p-6">
                  <span className="text-xl font-bold text-blue-600">
                    {course.price === 0 ? "Free" : `Rp ${course.price.toLocaleString('id-ID')}`}
                  </span>
                  <Link href={`/courses`}>
                    <Button size="sm" className="rounded-full bg-slate-900">Enroll Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}