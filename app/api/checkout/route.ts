import { createClient } from "@supabase/supabase-js"; // Gunakan client standar
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { courseId, price } = body;

    // Inisialisasi Admin Client (Bypass RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Pastikan ini ada di .env.local Anda
    );

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Gunakan upsert agar tidak error jika diklik berulang kali
    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .upsert({
        user_id: userId,
        course_id: courseId,
        price_paid: price,
        status: price === 0 ? "completed" : "pending",
      }, {
        onConflict: 'user_id, course_id'
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Admin Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}