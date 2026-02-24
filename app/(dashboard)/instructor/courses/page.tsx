import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateCourseModal from "@/components/instructor/CreateCourseModal";
import Link from "next/link";

export default async function InstructorCoursesPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("instructor_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Kursus Saya</h1>
          <p className="text-gray-500 text-sm">Kelola materi dan publikasi kursus Anda.</p>
        </div>
        <CreateCourseModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
            <p className="text-gray-400 font-medium">Belum ada kursus yang dibuat.</p>
          </div>
        ) : (
          courses?.map((course) => (
            <div key={course.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="object-cover w-full h-full group-hover:scale-105 transition" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300 text-xs font-medium uppercase tracking-widest">No Image</div>
                )}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${course.is_published ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {course.is_published ? "Published" : "Draft"}
                </div>
              </div>
              <div className="p-4">
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{course.category}</span>
                <h3 className="font-bold text-gray-800 line-clamp-1 mt-1">{course.title}</h3>
                <p className="text-blue-600 font-bold mt-2 text-sm">
                  {course.price === 0 ? "FREE" : `Rp ${course.price.toLocaleString('id-ID')}`}
                </p>
                <Link href={`/instructor/courses/${course.id}`}>
                  <button className="w-full mt-4 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition">
                    KELOLA KURSUS
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}