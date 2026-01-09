"use client";

import { useState } from "react";
import { Loader2, CloudUpload, CheckCircle2 } from "lucide-react"; // Professional icons

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadStart?: () => void;
  folder?: string;
}

export default function ImageUpload({ onUploadComplete, onUploadStart, folder = "assets" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Initialize Upload State
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);
    setIsSuccess(false);
    
    // Trigger parent loading state (for the blinking profile loader)
    if (onUploadStart) onUploadStart();

    // 2. Prepare Cloudinary Data
    const formData = new FormData();
    formData.append("file", file);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Missing Cloudinary Config in .env.local");
      setUploading(false);
      return;
    }

    formData.append("upload_preset", uploadPreset);
    if (folder) formData.append("folder", folder);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      
      const data = await res.json();
      
      if (data.secure_url) {
        onUploadComplete(data.secure_url);
        setIsSuccess(true);
        console.log("Uploaded successfully:", data.secure_url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full group">
      <label className={`
        relative w-full flex flex-col items-center justify-center min-h-[12rem] 
        border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
        ${uploading ? 'border-[#D4AF37] bg-blue-50/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#003153]'}
        ${isSuccess ? 'border-green-500 bg-green-50/10' : ''}
      `}>
        
        {/* Input Field */}
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {preview ? (
          <div className="relative w-full h-48 p-3">
            <img 
              src={preview} 
              alt="Preview" 
              className={`w-full h-full object-cover rounded-xl transition-opacity duration-500 ${uploading ? 'opacity-40' : 'opacity-100'}`} 
            />
            
            {/* 🟢 PROFESSIONAL UPLOADING OVERLAY */}
            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="bg-[#003153] p-3 rounded-full shadow-xl animate-bounce mb-2">
                  <Loader2 className="text-[#D4AF37] animate-spin" size={24} />
                </div>
                <span className="text-[#003153] text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Syncing Asset...
                </span>
              </div>
            )}

            {/* SUCCESS ICON */}
            {isSuccess && !uploading && (
              <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full shadow-lg animate-in zoom-in">
                <CheckCircle2 size={16} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 mb-4 group-hover:text-[#003153] group-hover:scale-110 transition-all">
              <CloudUpload size={28} />
            </div>
            <p className="mb-1 text-sm text-slate-600">
              <span className="font-bold text-[#003153]">Click to browse</span> or drag photo
            </p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
              High-resolution PNG, JPG or WEBP
            </p>
          </div>
        )}
      </label>
    </div>
  );
}