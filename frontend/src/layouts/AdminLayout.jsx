import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
