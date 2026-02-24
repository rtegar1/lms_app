"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import CreateCourseForm from "./CreateCourseForm";

export default function CreateCourseModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
        <Plus size={18} /> Tambah Kursus
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Buat Kursus Baru</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="p-6"><CreateCourseForm /></div>
          </div>
        </div>
      )}
    </>
  );
}