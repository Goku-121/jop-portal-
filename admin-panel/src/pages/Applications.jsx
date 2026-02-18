import { useEffect, useState } from "react";
import api from "../services/api";
import { Check, X, Trash2 } from "lucide-react";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/applications");
      setApps(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteApp = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/admin/applications/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/admin/applications/${id}/status`, { status });
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <span className="text-sm text-gray-500">
          Total: <strong>{apps.length}</strong>
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Job
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {apps.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-indigo-50/40 transition-colors duration-150"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {app.job?.title || "Deleted Job"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {app.applicant?.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      {app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || "Pending"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => changeStatus(app._id, "accepted")}
                      disabled={app.status === "accepted"}
                      className={`
                        inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium
                        transition-all duration-200 shadow-sm
                        ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-700 cursor-not-allowed opacity-60"
                            : "bg-green-50 text-green-700 hover:bg-green-600 hover:text-white hover:shadow-md hover:scale-105 active:scale-95"
                        }
                      `}
                    >
                      <Check size={14} />
                      Accept
                    </button>

                    <button
                      onClick={() => changeStatus(app._id, "rejected")}
                      disabled={app.status === "rejected"}
                      className={`
                        inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium
                        transition-all duration-200 shadow-sm
                        ${
                          app.status === "rejected"
                            ? "bg-red-100 text-red-700 cursor-not-allowed opacity-60"
                            : "bg-red-50 text-red-700 hover:bg-red-600 hover:text-white hover:shadow-md hover:scale-105 active:scale-95"
                        }
                      `}
                    >
                      <X size={14} />
                      Reject
                    </button>

                    <button
                      onClick={() => deleteApp(app._id)}
                      className="
                        inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700
                        shadow-sm transition-all hover:bg-gray-600 hover:text-white hover:shadow-md hover:scale-105 active:scale-95
                      "
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {apps.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No applications found
          </div>
        )}
      </div>
    </div>
  );
}