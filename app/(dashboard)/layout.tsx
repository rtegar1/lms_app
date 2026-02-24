import { auth } from "@clerk/nextjs/server"; // Wajib diimpor
import { SidebarDashboard } from "@/components/sidebar-dashboard";
import { UserButtonCustom } from "@/components/user-button-custom";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ambil data session dari Clerk secara real-time
  const { sessionClaims } = await auth();

  // Ambil role dari public metadata. 
  // Kita casting 'sessionClaims.metadata' agar TypeScript tidak komplain.
  const role = (sessionClaims?.metadata as { role?: string })?.role || null;

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
        <header className="h-16 bg-white border-b px-6 p-4 flex items-center justify-end sticky top-0 z-10">
          <div className="flex items-center gap-x-4">
            {/* Sekarang role akan otomatis terisi sesuai user yang login */}
            <UserButtonCustom />
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}