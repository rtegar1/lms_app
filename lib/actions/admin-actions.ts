"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function togglePublishCourse(courseId: string, isPublished: boolean) {
  const supabase = await createClient();

  // Update status berdasarkan parameter isPublished yang dikirim
  const { error } = await supabase
    .from("courses")
    .update({ is_published: isPublished })
    .eq("id", courseId);

  if (error) {
    throw new Error("Gagal mengubah status publikasi: " + error.message);
  }

  // Refresh data di halaman admin dan daftar kursus publik
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}