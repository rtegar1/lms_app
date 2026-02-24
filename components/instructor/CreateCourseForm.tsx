"use client";

import { useActionState } from "react";
import { createCourse } from "@/lib/actions/create-course";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
    >
      {pending ? "Sedang Menyimpan..." : "Simpan & Lanjutkan"}
    </button>
  );
}

export default function CreateCourseForm() {
  const [state, formAction] = useActionState(createCourse, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && (
        <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">
          {state.message}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Judul Kursus</label>
        <input name="title" type="text" required className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi</label>
        <textarea name="description" rows={3} className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
          <input name="price" type="number" required className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select name="category" className="w-full p-2 border rounded-md">
            <option value="Web Development">Web Development</option>
            <option value="Cyber Security">Cyber Security</option>
          </select>
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}