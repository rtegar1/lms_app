"use client";

import { useState } from "react";
import { updateLesson } from "@/lib/actions/lesson-actions";
import { PlayCircle, Save, Loader2, Youtube, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LessonVideoUpload({ courseId, lessonId, initialData }: any) {
  const [videoUrl, setVideoUrl] = useState(initialData.video_url || "");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi yang lebih kuat untuk konversi link YouTube
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Jika sudah format embed, biarkan saja
    if (url.includes("youtube.com/embed/")) return url;
    
    // Regex untuk menangkap Video ID dari berbagai format link YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      const videoId = match[2];
      // Tambahkan parameter origin untuk membantu masalah 'Video Unavailable'
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    
    return url;
  };

  const onSave = async () => {
    try {
      setIsLoading(true);
      const finalUrl = getEmbedUrl(videoUrl);
      
      if (!finalUrl || !finalUrl.includes("embed")) {
        alert("Link YouTube tidak valid. Mohon periksa kembali.");
        return;
      }

      await updateLesson(courseId, lessonId, { video_url: finalUrl });
      alert("Link video berhasil diperbarui!");
    } catch (error) {
      alert("Gagal menyimpan link");
    } finally {
      setIsLoading(false);
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="p-6 bg-white border rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center gap-x-2 text-slate-700 font-bold text-sm mb-2">
        <Youtube className="text-red-600" size={18} />
        <h2>YouTube Video Link</h2>
      </div>

      {/* Preview Player */}
      {embedUrl ? (
        <div className="aspect-video relative rounded-2xl overflow-hidden bg-black mb-4 border border-slate-200">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed rounded-2xl mb-4">
          <PlayCircle className="h-10 w-10 text-slate-300 mb-2" />
          <p className="text-[10px] text-slate-400 font-bold uppercase">Preview Akan Muncul di Sini</p>
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Paste link YouTube (Contoh: https://www.youtube.com/watch?v=...)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          disabled={isLoading}
          className="w-full p-4 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all"
        />
        
        <Button
          onClick={onSave}
          disabled={isLoading || !videoUrl || videoUrl === initialData.video_url}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl shadow-lg transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          SIMPAN LINK VIDEO
        </Button>
      </div>

      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <AlertCircle size={14} className="text-amber-600 mt-0.5" />
        <p className="text-[10px] text-amber-700 leading-tight">
          <strong>Catatan:</strong> Jika muncul "Video Unavailable", pastikan opsi <strong>"Allow embedding"</strong> sudah dicentang pada pengaturan video di YouTube Studio Anda.
        </p>
      </div>
    </div>
  );
}