"use client";

import { useState, useEffect } from "react";

type Notification = {
  id: string;
  message: string;
  link?: string;
  type: "INFO" | "ALERT" | "NEW";
  isActive: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [list, setList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ message: "", link: "", type: "INFO" });

  // 1. Fetch
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setList(data.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  // 2. Create
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message) return;
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ message: "", link: "", type: "INFO" }); // Reset
        fetchNotifications();
      }
    } catch (err) {
      alert("Error adding notification");
    } finally {
      setLoading(false);
    }
  };

  // 3. Toggle Status
  const toggleStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic Update (UI updates instantly)
    setList(prev => prev.map(n => n.id === id ? { ...n, isActive: !currentStatus } : n));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentStatus }),
      });
    } catch (err) {
      alert("Failed to update status");
      fetchNotifications(); // Revert on error
    }
  };

  // 4. Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notification?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setList(prev => prev.filter(n => n.id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">News Ticker & Notifications</h1>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Message</label>
            <input
              type="text"
              required
              placeholder="e.g. JEE Advanced Results are out! Check now."
              className="w-full border rounded-lg px-3 py-2"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
            <input
              type="text"
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 font-medium w-full md:w-auto"
          >
            {loading ? "Adding..." : "Post Update"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {list.map((item) => (
          <div key={item.id} className={`flex items-center justify-between p-4 border-b last:border-0 ${!item.isActive ? 'bg-gray-50 opacity-60' : ''}`}>
            
            <div className="flex items-start gap-3">
              <div className={`mt-1 w-2 h-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div>
                <p className="font-medium text-gray-800">{item.message}</p>
                {item.link && (
                  <a href={item.link} target="_blank" className="text-xs text-blue-600 hover:underline">
                    {item.link}
                  </a>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Toggle Switch */}
              <button
                onClick={() => toggleStatus(item.id, item.isActive)}
                className={`text-xs font-bold px-3 py-1 rounded-full transition ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
              >
                {item.isActive ? "LIVE" : "HIDDEN"}
              </button>
              
              <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

          </div>
        ))}
        {list.length === 0 && (
          <div className="p-8 text-center text-gray-400">No notifications yet.</div>
        )}
      </div>
    </div>
  );
}