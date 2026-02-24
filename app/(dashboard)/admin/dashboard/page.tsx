"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  ArrowUpRight, 
  Loader2, 
  Users, 
  Activity, 
  ShieldCheck, 
  BookOpen 
} from "lucide-react";
import { formatDistanceToNow, subDays, format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LoginLog {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  status: string;
}

interface ChartData {
  name: string;
  login: number;
}

export default function AdminDashboardPage() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Ambil Total User dari tabel profiles
        const { count } = await supabase
          .from("profiles")
          .select("*", { count: 'exact', head: true });
        
        if (count) setUserCount(count);

        // 2. Ambil Total Kursus (Dinamis)
        const { count: cCount } = await supabase
          .from("courses")
          .select("*", { count: 'exact', head: true });
        if (cCount) setCourseCount(cCount);

        // 2. Ambil Riwayat Login terbaru
        const { data: logData } = await supabase
          .from("login_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (logData) setLogs(logData);

        // 3. Logika Grafik Dinamis (7 Hari Terakhir)
        const last7Days = await Promise.all(
          [...Array(7)].map(async (_, i) => {
            const date = subDays(new Date(), i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
            const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();

            const { count } = await supabase
              .from("login_logs")
              .select("*", { count: 'exact', head: true })
              .gte("created_at", startOfDay)
              .lte("created_at", endOfDay);

            return {
              name: format(date, "EEE", { locale: id }), // Contoh: Sen, Sel, Rab
              login: count || 0,
              originalDate: date
            };
          })
        );

        // Urutkan dari hari terlama ke terbaru
        setChartData(last7Days.reverse());

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">Data login dan pengguna disinkronkan secara real-time.</p>
      </div>

      {/* Baris 1: Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={userCount.toString()} icon={<Users />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Total Login (7hr)" value={chartData.reduce((acc, curr) => acc + curr.login, 0).toString()} icon={<Activity />} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Total Kursus" value={courseCount.toString()} icon={<BookOpen />} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Sistem Status" value="Online" icon={<ShieldCheck />} color="text-rose-600" bg="bg-rose-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Grafik Dinamis */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Trafik Login Mingguan</h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLogin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="login" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLogin)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Kolom Rercent Login Tetap Sama */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Recent Login History</h3>
          {loading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
          ) : (
            <div className="space-y-6">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${log.status === "Success" ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{log.full_name}</p>
                      <p className="text-xs text-slate-400 capitalize">
                        {log.role} • {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: id })}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bg }: { title: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}