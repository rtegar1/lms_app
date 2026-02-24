"use server";

import { createClient } from "@/utils/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Fungsi untuk membuat kursus baru (digunakan oleh CreateCourseModal)
 */
export async function createCourse(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { userId } = await auth();

  if (!userId) {
    return { message: "Anda harus login terlebih dahulu melalui Clerk." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;

  const { data, error } = await supabase
    .from("courses")
    .insert([
      {
        title,
        description,
        price,
        category,
        instructor_id: userId,
        is_published: false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Database Error:", error);
    return { message: "Gagal membuat course: " + error.message };
  }

  revalidatePath("/instructor/dashboard");
  redirect(`/instructor/courses/${data.id}`);
}

/**
 * Fungsi untuk memperbarui detail utama kursus (digunakan oleh EditCourseModal)
 */
export async function updateCourse(
  courseId: string, 
  values: { title?: string; price?: number }
) {
  const supabase = await createClient();
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("courses")
    .update(values)
    .eq("id", courseId)
    .eq("instructor_id", userId);

  if (error) {
    console.error("Update Error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/instructor/courses/${courseId}`);
  revalidatePath("/instructor/courses");
}

/**
 * Fungsi untuk publikasi/unpublikasi kursus (digunakan oleh tombol Header)
 */
export async function togglePublishCourse(courseId: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("courses")
    .update({ is_published: !currentStatus })
    .eq("id", courseId)
    .eq("instructor_id", userId);

  if (error) {
    console.error("Publish Error:", error.message);
    throw new Error(error.message);
  }

  // Refresh data untuk instruktur dan halaman utama siswa
  revalidatePath(`/instructor/courses/${courseId}`);
  revalidatePath("/"); 
}