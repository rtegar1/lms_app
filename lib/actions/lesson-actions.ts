"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createLesson(moduleId: string, courseId: string, title: string) {
  const supabase = await createClient();

  // Ambil posisi terakhir
  const { data: lastLesson } = await supabase
    .from("lessons")
    .select("position")
    .eq("module_id", moduleId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = lastLesson ? lastLesson.position + 1 : 0;

  // Insert materi baru
  const { error } = await supabase
    .from("lessons")
    .insert([
      {
        title,
        module_id: moduleId,
        position: newPosition,
      },
    ]);

  if (error) {
    // Tampilkan log error di terminal VS Code Anda
    console.error("SUPABASE_ERROR_LESSON:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/instructor/courses/${courseId}`);
}

export async function updateLesson(
  courseId: string, 
  lessonId: string, 
  values: { video_url?: string; description?: string }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("lessons")
    .update(values)
    .eq("id", lessonId);

  if (error) throw new Error(error.message);

  revalidatePath(`/instructor/courses/${courseId}/lessons/${lessonId}`);
  revalidatePath(`/instructor/courses/${courseId}`);
}