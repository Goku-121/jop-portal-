import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { Trash2, Briefcase, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";

// Fetch all jobs (no pagination from backend, we'll handle it client-side)
const fetchAllJobs = async () => {
  const { data } = await api.get("/admin/jobs"); // No page/limit params
  return data; // Expecting direct array of jobs
};

export default function Jobs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const itemsPerPage = 20; // 20 jobs per page

  // Fetch all jobs once (since backend doesn't paginate)
  const { data: allJobsRaw = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-all-jobs"],
    queryFn: fetchAllJobs,
  });

  // Filter jobs based on search (client-side)
  const filteredJobs = allJobsRaw.filter((job) => {
    const titleMatch = job?.title?.toLowerCase().includes(searchTitle.toLowerCase().trim());
    const locationMatch = job?.location?.toLowerCase().includes(searchLocation.toLowerCase().trim());
    return titleMatch && locationMatch;
  });

  // Pagination logic
  const totalFiltered = filteredJobs.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      alert("Job deleted successfully!");
      refetch(); // Reload all jobs after delete
      setCurrentPage(1); // Reset to first page
    } catch {
      alert("Failed to delete job.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 after search
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-center px-4">
        <div className="max-w-md">
          <AlertCircle className="mx-auto text-red-500" size={64} />
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Something went wrong</h2>
          <p className="mt-3 text-gray-600">{error?.message || "Failed to load jobs."}</p>
          <button
            onClick={() => refetch()}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-linear-to-br from-indigo-500 to-blue-600 p-4 rounded-2xl shadow-lg">
              <Briefcase className="text-white" size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">All Jobs</h1>
          </div>

          <div className="bg-white px-6 py-3 rounded-xl shadow-md border border-gray-200 text-sm font-medium text-gray-700">
            Showing {currentJobs.length} of {totalFiltered} jobs
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by job title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
            <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
            <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>

        {/* Jobs Table */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-indigo-50 to-blue-50">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Posted By</th>
                  <th className="px-6 py-5 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentJobs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-gray-500 text-lg font-medium">
                      No jobs found. Try changing search or check if jobs exist.
                    </td>
                  </tr>
                ) : (
                  currentJobs.map((job, index) => (
                    <tr
                      key={job?._id || `job-${index}`}
                      className="group hover:bg-indigo-50/50 transition-all duration-200"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-indigo-700">
                        {job?.title || "No Title"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                        {job?.location || "—"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                        {job?.postedBy?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <button
                          onClick={() => deleteJob(job?._id)}
                          disabled={!job?._id}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-linear-to-r from-red-50 to-red-100 text-red-700 border border-red-200 hover:from-red-600 hover:to-red-700 hover:text-white hover:border-transparent hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} className="group-hover:animate-pulse" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalFiltered > 0 && (
            <div className="py-4 px-6 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} ({totalFiltered} total jobs)
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}