"use server";

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const getInstructors = async () => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, full_name, email,
      instructor_details (
        institution, phone_number, bio, 
        bank_name, account_number, balance
      )
    `)
    .eq('role', 'instructor')
    .order('created_at', { ascending: false });

  if (error) return [];

  return data.map((item: any) => ({
    id: item.id,
    full_name: item.full_name,
    email: item.email,
    institution: item.instructor_details?.institution || "-",
    phone_number: item.instructor_details?.phone_number || "-",
    bio: item.instructor_details?.bio || "",
    bank_name: item.instructor_details?.bank_name || "-",
    account_number: item.instructor_details?.account_number || "-",
    balance: item.instructor_details?.balance || 0
  }));
};

export const updateInstructorProfile = async (id: string, formData: any) => {
  const supabase = await createClient();

  // Update Profiles
  await supabase.from('profiles').update({
    full_name: formData.full_name,
    email: formData.email
  }).eq('id', id);

  // Update Instructor Details
  const { error } = await supabase
    .from('instructor_details')
    .update({
      institution: formData.institution,
      phone_number: formData.phone_number,
      bio: formData.bio,
      bank_name: formData.bank_name,
      account_number: formData.account_number,
      balance: formData.balance,
      updated_at: new Date(),
    })
    .eq('id', id);

  if (error) throw error;
  
  revalidatePath('/admin/instructors');
  return { success: true };
};