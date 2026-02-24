import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  // 1. Ambil Secret dari environment variable
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // 2. Ambil header verifikasi dari Svix
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Jika header tidak lengkap, tolak request
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // 3. Ambil body request
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // 4. Verifikasi Webhook menggunakan Svix
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Webhook Verification Failed:", err);
    return new Response('Error occured', { status: 400 })
  }

  const eventType = evt.type;

  // --- LOGIKA 1: PENDAFTARAN USER BARU (user.created) ---
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata } = evt.data;
    
    // Ambil role dari unsafe_metadata yang dikirim saat Sign Up kustom
    const userRole = (unsafe_metadata?.role as string) || 'student';
    
    console.log(`WEBHOOK: Memproses user baru ${id}`);

    const { error } = await supabase
      .from('profiles')
      .insert({
        id: id,
        email: email_addresses[0].email_address,
        full_name: `${first_name || ""} ${last_name || ""}`.trim(),
        image_url: image_url,
        role: userRole 
      });

    if (error) {
      console.error("SUPABASE PROFILES ERROR:", error.message);
      return new Response(JSON.stringify(error), { status: 500 });
    }
    console.log("SUKSES: User profile dibuat.");
  }

  // --- LOGIKA 2: PENCATATAN LOGIN (session.created) ---
  if (eventType === 'session.created') {
    // Pada session.created, ID user ada di properti user_id
    const { user_id } = evt.data;

    if (user_id) {
      // Ambil data profile terbaru untuk mendapatkan Nama dan Role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user_id)
        .single();

      if (profileError) {
        console.error("WEBHOOK SESSION: Gagal ambil profil:", profileError.message);
      }

      // Masukkan ke tabel login_logs untuk history dashboard admin
      const { error: logError } = await supabase
        .from('login_logs')
        .insert({
          user_id: user_id,
          full_name: profile?.full_name || "Unknown User",
          role: profile?.role || "student",
          status: "Success"
        });

      if (logError) {
        console.error("SUPABASE LOG ERROR:", logError.message);
      } else {
        console.log(`SUKSES: Login history tercatat untuk ${profile?.full_name || user_id}`);
      }
    }
  }

  return new Response('Webhook handled successfully', { status: 200 })
}