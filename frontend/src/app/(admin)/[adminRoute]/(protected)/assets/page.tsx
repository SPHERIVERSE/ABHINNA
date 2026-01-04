"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";

// Define the Asset type matching your Schema
type Asset = {
  id: string;
  title: string;
  type: "GALLERY" | "RESULT" | "FACULTY" | "BANNER" | "POSTER" | "IMAGE";
  fileUrl: string;
};

const ASSET_TYPES = [
  { label: "Gallery Photos", value: "GALLERY" },
  { label: "Exam Results", value: "RESULT" },
  { label: "Faculty Profiles", value: "FACULTY" },
  { label: "Website Banners", value: "BANNER" },
  { label: "Posters / Ads", value: "POSTER" },
];

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState("ALL"); // "ALL" or specific type
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({ title: "", type: "GALLERY", url: "" });

  // 1. Fetch Assets on Load
  const fetchAssets = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAssets(data.assets);
      });
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // 2. Handle Tab Change (Auto-update form type too)
  const handleTabChange = (type: string) => {
    setActiveTab(type);
    if (type !== "ALL") {
      setForm((prev) => ({ ...prev, type }));
    }
  };

  const handleImageUploaded = (url: string) => {
    setForm((prev) => ({ ...prev, url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url) return alert("Please upload an image first");

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      
      // Update UI immediately
      setAssets([data.asset, ...assets]);
      setForm((prev) => ({ ...prev, title: "", url: "" })); // Keep type same
      alert("Asset Saved!");

    } catch (error) {
      alert("Error saving asset");
    } finally {
      setLoading(false);
    }
  };

  // 3. Filter Logic
  const filteredAssets = activeTab === "ALL" 
    ? assets 
    : assets.filter((asset) => asset.type === activeTab);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Asset Manager</h1>

      {/* 🟢 MODULAR TABS */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        <button
          onClick={() => handleTabChange("ALL")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "ALL" 
              ? "bg-blue-900 text-white shadow-md" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Assets
        </button>
        {ASSET_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => handleTabChange(type.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === type.value
                ? "bg-blue-900 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Upload Form (Sticky) */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-6">
            <h2 className="font-semibold text-gray-800 mb-4">Add New Asset</h2>
            <div className="mb-4">
               <ImageUpload onUploadComplete={handleImageUploaded} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Fest 2024"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase">Category</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-50"
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                >
                  {ASSET_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !form.url}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {loading ? "Saving..." : "Save to Library"}
              </button>
            </form>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="md:col-span-2">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="relative group border rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition">
                {/* Image Aspect Ratio Container */}
                <div className="aspect-square relative">
                  <img src={asset.fileUrl} alt={asset.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6">
                  <p className="text-white text-sm font-medium truncate">{asset.title}</p>
                  <p className="text-gray-300 text-xs uppercase tracking-wider">{asset.type}</p>
                </div>

                {/* Optional: Add a 'Copy URL' or 'Delete' button here later */}
              </div>
            ))}

            {filteredAssets.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed rounded-xl">
                No {activeTab === "ALL" ? "" : activeTab.toLowerCase()} assets found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}