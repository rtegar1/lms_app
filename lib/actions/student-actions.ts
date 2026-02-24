"use server"; 

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const getStudents = async () => {
  const supabase = await createClient();
  
  // Mengambil data profile JOIN dengan student_details
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, 
      full_name, 
      email, 
      student_details (
        institution, 
        phone_number, 
        bio, 
        points
      )
    `)
    .eq('role', 'student') 
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Kesalahan Supabase:", error.message);
    return [];
  }

  // Meratakan (flatten) data agar mudah digunakan di komponen
  return data.map((item: any) => ({
    id: item.id,
    full_name: item.full_name,
    email: item.email,
    institution: item.student_details?.institution || "-",
    phone_number: item.student_details?.phone_number || "-",
    bio: item.student_details?.bio || "",
    points: item.student_details?.points || 0
  }));
};

export const updateStudentProfile = async (id: string, formData: any) => {
  const supabase = await createClient();

  // Update tabel inti (profiles)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: formData.full_name,
      email: formData.email,
    })
    .eq('id', id);

  if (profileError) throw profileError;

  // Update tabel detail (student_details)
  const { error: detailError } = await supabase
    .from('student_details')
    .update({
      bio: formData.bio,
      phone_number: formData.phone_number,
      institution: formData.institution,
      updated_at: new Date(),
    })
    .eq('id', id);

  if (detailError) throw detailError;
  
  revalidatePath('/admin/students');
  return { success: true };
};