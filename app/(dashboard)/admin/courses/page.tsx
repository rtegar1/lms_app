import { createClient } from "@/utils/supabase/server";
import CourseStatusButton from "@/components/admin/PublishButton";

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  // Ambil semua kursus untuk dikelola oleh admin
  const { data: allCourses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Manajemen Publikasi Kursus</h1>
        <p className="text-gray-500 text-sm">Setujui kursus baru atau batalkan publikasi kursus yang melanggar aturan.</p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-sm text-gray-600">Judul Kursus</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Harga</th>
              <th className="p-4 font-semibold text-sm text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {allCourses?.map((course) => (
              <tr key={course.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                <td className="p-4">
                  <p className="font-medium text-gray-800">{course.title}</p>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">
                    {course.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    course.is_published 
                      ? "bg-green-100 text-green-700" 
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {course.is_published ? "Live" : "Pending"}
                  </span>
                </td>
                <td className="p-4 text-sm font-semibold text-gray-700">
                  {course.price === 0 ? "Free" : `Rp ${course.price.toLocaleString("id-ID")}`}
                </td>
                <td className="p-4">
                  <CourseStatusButton 
                    courseId={course.id} 
                    isPublished={course.is_published} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}