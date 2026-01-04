"use client";

import { useState } from "react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ onUploadComplete, folder = "assets" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Show immediate preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    // 2. Upload to Cloudinary (Unsigned)
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

    try {
      // ⚠️ REPLACE 'your_cloud_name' with your actual Cloudinary Cloud Name
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
      
      const data = await res.json();
      
      if (data.secure_url) {
        onUploadComplete(data.secure_url);
        console.log("Uploaded:", data.secure_url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload image. Check console.");
      setPreview(null); // Reset on failure
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label className="w-full flex flex-col items-center justify-center h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
        
        {preview ? (
          <div className="relative w-full h-full p-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-md" 
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                <span className="text-white text-sm font-medium">Uploading...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> image</p>
            <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
          </div>
        )}
        
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
