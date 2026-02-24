"use client";

import { togglePublishCourse } from "@/lib/actions/admin-actions";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface CourseStatusButtonProps {
  courseId: string;
  isPublished: boolean;
}

export default function CourseStatusButton({ courseId, isPublished }: CourseStatusButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const actionText = isPublished ? "membatalkan publikasi" : "mempublikasikan";
    if (!confirm(`Apakah Anda yakin ingin ${actionText} kursus ini?`)) return;
    
    setLoading(true);
    try {
      // Jika isPublished true, maka kita kirim false (unpublish), dan sebaliknya
      await togglePublishCourse(courseId, !isPublished);
    } catch (error) {
      alert("Terjadi kesalahan saat memproses permintaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition disabled:bg-gray-400 font-medium text-sm ${
        isPublished 
          ? "bg-red-100 text-red-600 hover:bg-red-200" 
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
    >
      {isPublished ? <XCircle size={16} /> : <CheckCircle size={16} />}
      {loading ? "Processing..." : isPublished ? "Unpublish" : "Approve & Publish"}
    </button>
  );
}