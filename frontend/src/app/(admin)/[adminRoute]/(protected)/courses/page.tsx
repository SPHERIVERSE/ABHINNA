"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config"; // Ensure you created this, or use process.env.NEXT_PUBLIC_API_URL

type Course = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  _count?: {
    batches: number;
  };
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ title: "", description: "" });
  const [isFormOpen, setIsFormOpen] = useState(false); // To toggle the "Add New" form

  // 1. Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 2. Handle Create
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      await fetchCourses(); // Refresh list
      setForm({ title: "", description: "" });
      setIsFormOpen(false); // Close form
      alert("Course Created Successfully!");
      
    } catch (error) {
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Courses Management</h1>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          {isFormOpen ? "Cancel" : "+ Add New Course"}
        </button>
      </div>

      {/* Add Course Form (Collapsible) */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold mb-4">Create New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. JEE Mains 2025 - Crash Course"
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Short details about the course..."
                className="w-full border rounded-lg px-3 py-2 mt-1"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </form>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {course.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
              <span>{course._count?.batches || 0} Batches</span>
              <button className="text-blue-600 hover:underline">View Details →</button>
            </div>
          </div>
        ))}

        {courses.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
            No courses found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}