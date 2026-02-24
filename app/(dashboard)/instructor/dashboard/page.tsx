import { 
  Users, 
  BookOpen, 
  Wallet, 
  TrendingUp, 
  PlayCircle, 
  CheckCircle 
} from "lucide-react";

export default async function InstructorDashboardPage() {
  // Data dummy - Nantinya bisa diambil dari database Supabase Anda
  const stats = [
    {
      label: "Total Siswa",
      value: "154",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "+12% dari bulan lalu"
    },
    {
      label: "Kursus Aktif",
      value: "12",
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      trend: "2 kursus baru"
    },
    {
      label: "Total Pendapatan",
      value: "Rp 4.250.000",
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "Saldo tersedia"
    },
    {
      label: "Rating Rata-rata",
      value: "4.8",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "98 ulasan positif"
    }
  ];

  return (
    <div className="p-4 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Halo, Instruktur! 👋</h1>
        <p className="text-slate-500 mt-2 font-medium">Berikut adalah ringkasan performa kursus Anda hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
              <p className="text-[11px] text-slate-400 mt-2 font-bold bg-slate-50 px-3 py-1 rounded-full inline-block italic">
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Aktivitas Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Aktivitas Kursus Terbaru</h3>
            <button className="text-sm font-bold text-blue-600 hover:underline">Lihat Semua</button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <PlayCircle size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-700">Siswa baru bergabung di "Web Development Next.js"</p>
                  <p className="text-xs text-slate-400 font-medium">2 jam yang lalu</p>
                </div>
                <div className="text-emerald-500 bg-emerald-50 p-2 rounded-full">
                  <CheckCircle size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Profile Summary */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Pusat Bantuan</h3>
            <p className="text-blue-100 text-sm leading-relaxed">Punya kendala dalam mengunggah materi kursus? Tim support kami siap membantu Anda 24/7.</p>
          </div>
          
          <div className="mt-8 space-y-3">
            <button className="w-full py-3 bg-white text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg">
              Buat Kursus Baru
            </button>
            <button className="w-full py-3 bg-blue-500/30 text-white border border-blue-400/30 rounded-2xl font-bold text-sm hover:bg-blue-500/50 transition-all">
              Tarik Saldo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}