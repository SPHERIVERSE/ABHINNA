"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Pencil, Trash2 } from "lucide-react"; // Import Icons

type Faculty = {
  id: string;
  name: string;
  designation: string;
  bio?: string;
  category: "TEACHING" | "LEADERSHIP"; // ✅ Added Category
  photo?: {
    fileUrl: string;
  };
};

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // ✅ Track if we are editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({ 
    name: "", 
    designation: "", 
    bio: "", 
    photoUrl: "",
    category: "TEACHING" // Default
  });

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

  const handlePhotoUploaded = (url: string) => {
    setForm((prev) => ({ ...prev, photoUrl: url }));
  };

  // ✅ Handle Edit Click
  const handleEdit = (faculty: Faculty) => {
    setEditingId(faculty.id);
    setForm({
      name: faculty.name,
      designation: faculty.designation,
      bio: faculty.bio || "",
      photoUrl: faculty.photo?.fileUrl || "",
      category: faculty.category || "TEACHING"
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  // ✅ Handle Cancel
  const resetForm = () => {
    setForm({ name: "", designation: "", bio: "", photoUrl: "", category: "TEACHING" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.photoUrl) return alert("Please upload a photo first");
    
    setLoading(true);
    try {
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/faculty/${editingId}` // PUT
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/faculty`;             // POST
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      await fetchFaculty();
      resetForm();
      alert(editingId ? "Profile Updated!" : "Profile Created!");
      
    } catch (error) {
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to remove this profile?")) return;
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
        <h1 className="text-2xl font-bold text-gray-800">Faculty & Leadership</h1>
        <button 
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className={`px-4 py-2 rounded-lg transition shadow-sm text-white ${isFormOpen ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-900 hover:bg-blue-800'}`}
        >
          {isFormOpen ? "Cancel" : "+ Add Member"}
        </button>
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 animate-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            {editingId ? "Edit Profile" : "New Profile Details"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border relative">
                 {/* Show existing image if available */}
                 {form.photoUrl && !editingId && <img src={form.photoUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                 <ImageUpload onUploadComplete={handlePhotoUploaded} />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Square Image Recommended</p>
            </div>

            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-50"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                >
                  <option value="TEACHING">Teaching Faculty</option>
                  <option value="LEADERSHIP">Leadership / Founder</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <input
                        type="text"
                        required
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        value={form.designation}
                        onChange={(e) => setForm({...form, designation: e.target.value})}
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={form.bio}
                  onChange={(e) => setForm({...form, bio: e.target.value})}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                    type="submit"
                    disabled={loading || !form.photoUrl}
                    className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                    {loading ? "Saving..." : (editingId ? "Update Profile" : "Save Profile")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facultyList.map((faculty) => (
          <div key={faculty.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col group relative">
            {/* Category Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold rounded uppercase ${faculty.category === 'LEADERSHIP' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
              {faculty.category}
            </div>

            <div className="flex p-4 gap-4 items-start">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                    <img 
                        src={faculty.photo?.fileUrl || "https://via.placeholder.com/150"} 
                        alt={faculty.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">{faculty.name}</h3>
                    <p className="text-blue-900 text-xs font-medium">{faculty.designation}</p>
                </div>
            </div>
            
            <div className="px-4 pb-4 flex-grow">
                <p className="text-gray-600 text-xs line-clamp-3">
                    {faculty.bio}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center">
                <button 
                    onClick={() => handleEdit(faculty)}
                    className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:underline"
                >
                    <Pencil size={12} /> Edit
                </button>
                <button 
                    onClick={() => handleDelete(faculty.id)}
                    className="text-red-500 text-xs font-medium flex items-center gap-1 hover:text-red-700"
                >
                    <Trash2 size={12} /> Remove
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}