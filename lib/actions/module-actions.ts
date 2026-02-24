"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createModule(courseId: string, title: string) {
  const supabase = await createClient();

  // 1. Ambil urutan posisi terakhir agar modul baru ada di bawah
  const { data: lastModule } = await supabase
    .from("modules")
    .select("position")
    .eq("course_id", courseId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = lastModule ? lastModule.position + 1 : 0;

  // 2. Insert modul baru
  const { error } = await supabase
    .from("modules")
    .insert([
      {
        title,
        course_id: courseId,
        position: newPosition,
      },
    ]);

  if (error) throw new Error(error.message);

  revalidatePath(`/instructor/courses/${courseId}`);
}

export async function deleteModule(courseId: string, moduleId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("modules")
    .delete()
    .eq("id", moduleId);

  if (error) throw new Error(error.message);

  revalidatePath(`/instructor/courses/${courseId}`);
}