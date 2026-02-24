"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Membangun LMS Modern dengan Next.js dan Supabase",
    excerpt: "Panduan lengkap membangun sistem manajemen pembelajaran yang scalable menggunakan teknologi terbaru di tahun 2026.",
    author: "Tegarsantosa",
    date: "15 Feb 2026",
    readTime: "8 min",
    category: "Development",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Tips Keamanan Web: Menghindari SQL Injection",
    excerpt: "Belajar dasar-dasar cybersecurity untuk pemula dan bagaimana cara melindungi database aplikasi Anda dari serangan luar.",
    author: "Tobi",
    date: "10 Feb 2026",
    readTime: "5 min",
    category: "Cybersecurity",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Optimasi SEO untuk Developer Next.js",
    excerpt: "Cara memaksimalkan Metadata API dan Server-Side Rendering untuk mendapatkan ranking pertama di Google.",
    author: "Rahmadi",
    date: "02 Feb 2026",
    readTime: "6 min",
    category: "SEO",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 pt-28 pb-12 min-h-screen">
      {/* Header Section */}
      <div className="max-w-3xl mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Blog & Artikel
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Berbagi wawasan seputar web development, cybersecurity, dan pengalaman membangun project digital.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="flex flex-col group cursor-pointer">
            {/* Image Wrapper */}
            <div className="relative aspect-[16/10] mb-6 overflow-hidden rounded-2xl">
              <img 
                src={post.image} 
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {post.readTime}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{post.author}</span>
                </div>
                
                <Link href={`/blog/${post.id}`} className="text-blue-600 flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all">
                  Baca <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter / CTA Section */}
      <div className="mt-24 p-8 md:p-12 bg-gray-900 rounded-[2rem] text-center text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Jangan Ketinggalan Update!</h3>
          <p className="text-gray-400 mb-8 text-sm md:text-base">
            Dapatkan notifikasi artikel terbaru seputar tech langsung ke email Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Email Anda" 
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500 transition-colors text-white"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
              Subscribe
            </button>
          </div>
        </div>
        {/* Dekorasi Abstract */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}