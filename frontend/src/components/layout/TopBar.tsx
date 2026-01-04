export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex justify-between">
      <div>
        <h1 className="text-primary font-semibold">Institute Name</h1>
        <p className="text-xs text-gray-500">Excellence in Education</p>
      </div>
      <div className="text-sm">Admin</div>
    </header>
  );
}

