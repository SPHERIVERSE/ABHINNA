"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";

// Define the shape of our data
type Faculty = {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  photo?: {
    fileUrl: string;
  };
};

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({ 
    name: "", 
    designation: "", 
    bio: "", 
    photoUrl: "" 
  });

  // 1. Fetch Data
  const fetchFaculty = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/faculty`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setFacultyList(data.facultyList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  // 2. Handle Photo Upload
  const handlePhotoUploaded = (url: string) => {
    setForm((prev) => ({ ...prev, photoUrl: url }));
  };

  // 3. Submit Profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.photoUrl) return alert("Please upload a photo first");
    
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/faculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      await fetchFaculty();
      setForm({ name: "", designation: "", bio: "", photoUrl: "" });
      setIsFormOpen(false);
      alert("Faculty Profile Created!");
      
    } catch (error) {
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to remove this faculty member?")) return;
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/faculty/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        setFacultyList(prev => prev.filter(f => f.id !== id));
    } catch(err) { alert("Delete failed"); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty & Staff</h1>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm"
        >
          {isFormOpen ? "Cancel" : "+ Add Faculty Member"}
        </button>
      </div>

      {/* Add Form */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 animate-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">New Profile Details</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: Photo Upload */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border">
                 <ImageUpload onUploadComplete={handlePhotoUploaded} />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Recommended: Square Image</p>
            </div>

            {/* Right: Text Details */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        placeholder="e.g. Dr. R.K. Sharma"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Designation / Subject</label>
                    <input
                        type="text"
                        required
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        placeholder="e.g. Senior Physics Faculty"
                        value={form.designation}
                        onChange={(e) => setForm({...form, designation: e.target.value})}
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Short Bio</label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  placeholder="e.g. 15+ years of experience in coaching JEE aspirants..."
                  value={form.bio}
                  onChange={(e) => setForm({...form, bio: e.target.value})}
                />
              </div>

              <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading || !form.photoUrl}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facultyList.map((faculty) => (
          <div key={faculty.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col group">
            <div className="flex p-4 gap-4 items-start">
                {/* Avatar Image */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                    <img 
                        src={faculty.photo?.fileUrl || "https://via.placeholder.com/150"} 
                        alt={faculty.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Info */}
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">{faculty.name}</h3>
                    <p className="text-blue-900 text-sm font-medium">{faculty.designation}</p>
                </div>
            </div>
            
            <div className="px-4 pb-4 flex-grow">
                <p className="text-gray-600 text-sm line-clamp-3">
                    {faculty.bio || "No bio available."}
                </p>
            </div>

            {/* Actions Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t flex justify-end">
                <button 
                    onClick={() => handleDelete(faculty.id)}
                    className="text-red-500 text-xs hover:text-red-700 font-medium"
                >
                    DELETE
                </button>
            </div>
          </div>
        ))}

        {facultyList.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border-dashed border-2">
                No faculty members added yet.
            </div>
        )}
      </div>
    </div>
  );
}