"use client";

import React from "react";
import { Code2, Cpu, Globe, GraduationCap, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 pt-28 pb-12 min-h-screen">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Membangun Solusi Digital dari <span className="text-blue-600">Kota Blitar</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Halo! Saya <strong>Rahmadi Tegar Santosa Miswanto</strong> (Tobi), seorang Web Developer dan Sarjana Teknik Elektro yang berfokus pada pengembangan aplikasi web modern yang aman dan efisien.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
              <GraduationCap size={20} /> S.T. Elektro
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
              <Code2 size={20} /> Web Developer
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop" 
              alt="Rahmadi Tegar"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>

      {/* Stats/Highlight Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
        {[
          { label: "Project Selesai", value: "10+" },
          { label: "Teknologi", value: "Next.js/Laravel" },
          { label: "Lokasi", value: "Blitar, ID" },
          { label: "Pengalaman", value: "Freelance" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Expertise Section */}
      <div className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Keahlian & Fokus</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Web Development</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Spesialisasi dalam membangun aplikasi web responsif menggunakan Next.js, Tailwind CSS, dan integrasi API modern.
            </p>
          </div>

          <div className="p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Cybersecurity</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Memiliki ketertarikan kuat dalam ethical hacking dan keamanan data untuk memastikan aplikasi yang dibangun tetap aman dari ancaman.
            </p>
          </div>

          <div className="p-8 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Sistem Terintegrasi</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Memanfaatkan latar belakang teknik elektro untuk memahami arsitektur sistem yang kompleks dan efisien.
            </p>
          </div>
        </div>
      </div>

      {/* Story/Brand Section */}
      <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <Zap className="mx-auto mb-6 text-yellow-400" size={40} />
          <h2 className="text-3xl font-bold mb-6">Tentang Tobiproject</h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Tobiproject adalah inisiatif saya untuk menyediakan layanan pembuatan website berkualitas bagi bisnis dan individu. Fokus utama saya adalah menggabungkan fungsionalitas teknis dengan desain yang intuitif.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition-all">
            Mari Berkolaborasi
          </button>
        </div>
      </div>
    </div>
  );
}