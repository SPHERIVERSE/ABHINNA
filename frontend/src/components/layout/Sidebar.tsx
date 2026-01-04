export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 bg-white border-r p-4">
      <nav className="space-y-3">
        <div className="font-medium text-primary">Dashboard</div>
        <div>Courses</div>
        <div>Faculty</div>
        <div>Media</div>
        <div>Notifications</div>
      </nav>
    </aside>
  );
}

