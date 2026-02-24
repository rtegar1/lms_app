import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export const checkRole = async (allowedRoles: string[]) => {
  const user = await currentUser();
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id)
    .single();

  return allowedRoles.includes(data?.role || '');
};