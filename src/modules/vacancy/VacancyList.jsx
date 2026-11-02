import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Filter, Users, Calendar, UserCheck, CheckCircle2, ChevronLeft, ChevronRight, Eye, FileText, X } from "lucide-react";
import Footer from "../../components/common/Footer";
import { fetchVacancies } from "../../redux/slice/vacancy/vacancySlice";

const VacancyList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { vacancies, pagination, loading } = useSelector((state) => state.vacancy);
  const [selectedJdVacancy, setSelectedJdVacancy] = useState(null);

  // Parse state directly from URL query parameters
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 10;
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";
  const selectedWorkMode = searchParams.get("workMode") || "All";
  const selectedHiring = searchParams.get("hiring") || "All";

  // Helper function to update URL search parameters cleanly
  const updateQueryParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "All") {
        updated.set(key, value);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  // Dispatch API call when URL search parameters change
  useEffect(() => {
    dispatch(
      fetchVacancies({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        category: selectedCategory,
        workMode: selectedWorkMode,
        hiring: selectedHiring,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, searchQuery, selectedCategory, selectedWorkMode, selectedHiring]);

  // Client-side safety filter fallback
  const filteredVacancies = (vacancies || []).filter((vac) => {
    const profileStr = vac.profile || vac.designation || "";
    const categoryStr = vac.category || "";
    const locationStr = vac.location || vac.city || "";
    const stateStr = vac.state || "";
    const workModeStr = vac.workMode || "";
    const hiringStr = vac.hiring || "Internal";

    const matchesSearch =
      profileStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locationStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stateStr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || categoryStr.toLowerCase() === selectedCategory.toLowerCase();

    const matchesWorkMode =
      selectedWorkMode === "All" || workModeStr.toLowerCase() === selectedWorkMode.toLowerCase();

    const matchesHiring =
      selectedHiring === "All" || hiringStr.toLowerCase() === selectedHiring.toLowerCase();

    return matchesSearch && matchesCategory && matchesWorkMode && matchesHiring;
  });

  const totalCount = pagination?.total ?? filteredVacancies.length;
  const totalPages = pagination?.totalPages || Math.ceil(totalCount / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayVacancies = filteredVacancies;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateQueryParams({ page: newPage });
    }
  };

  const getWorkModeClass = (mode) => {
    if (!mode || mode === "N/A") return "text-gray-400 font-medium text-xs";
    switch (mode.toLowerCase()) {
      case "remote":
        return "text-emerald-600 font-bold text-xs";
      case "hybrid":
        return "text-amber-600 font-bold text-xs";
      case "onsite":
        return "text-blue-600 font-bold text-xs";
      default:
        return "text-gray-600 font-medium text-xs";
    }
  };

  const getHiringBadge = (hiring) => {
    if (!hiring || hiring === "N/A") return "border-gray-200 bg-gray-50 text-gray-500";
    const mode = hiring.toLowerCase();
    switch (mode) {
      case "internal":
        return "border-purple-200 bg-purple-50/60 text-purple-700";
      case "external":
        return "border-blue-200 bg-blue-50/60 text-blue-600";
      default:
        return "border-gray-200 bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 font-sans shadow-sm">
      <div className="mx-auto">
        {/* Header Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Job Vacancies</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse current open positions and submit candidate details with CV links.
          </p>
        </div>

        <hr className="mb-6 border-gray-300" />

        {/* Search & Dual Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="relative w-full md:w-1/3">
            <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by profile, category, location, state..."
              value={searchQuery}
              onChange={(e) => {
                updateQueryParams({ search: e.target.value, page: 1 });
              }}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Filter size={16} /> Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  updateQueryParams({ category: e.target.value, page: 1 });
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700"
              >
                <option value="All">All Categories</option>
                <option value="IT">IT</option>
                <option value="Non IT">Non IT</option>
              </select>
            </div>

            {/* Hiring Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                Hiring:
              </span>
              <select
                value={selectedHiring}
                onChange={(e) => {
                  updateQueryParams({ hiring: e.target.value, page: 1 });
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700"
              >
                <option value="All">All Hiring</option>
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select>
            </div>

            {/* Work Mode Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                Work Mode:
              </span>
              <select
                value={selectedWorkMode}
                onChange={(e) => {
                  updateQueryParams({ workMode: e.target.value, page: 1 });
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700"
              >
                <option value="All">All Work Modes</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vacancies Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-4 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#8931BA] text-white">
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Sr.</th>
                <th className="py-3 px-3 font-semibold text-left text-xs tracking-wide whitespace-nowrap">Category</th>
                <th className="py-3 px-3 font-semibold text-left text-xs tracking-wide whitespace-nowrap">Profile / Designation</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Hiring</th>
                <th className="py-3 px-3 font-semibold text-left text-xs tracking-wide whitespace-nowrap">State</th>
                <th className="py-3 px-3 font-semibold text-left text-xs tracking-wide whitespace-nowrap">City</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Vacancy</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Applied</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Work Mode</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Deadline</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-purple-700 font-medium text-xs">
                    Loading job vacancies...
                  </td>
                </tr>
              ) : displayVacancies.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-10 text-gray-400 font-medium text-xs">
                    No job vacancies found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                displayVacancies.map((item, index) => {
                  const vacanciesCount = Number(item.candidatesCount ?? item.numberOfVacancies ?? 0);
                  const submittedCount = Number(item.submittedCount ?? item.applicationSubmittedCount ?? 0);
                  const isFilled = vacanciesCount > 0 && submittedCount >= vacanciesCount;

                  return (
                    <tr key={item.id || index} className="hover:bg-purple-50/30 transition-colors border-b border-gray-100">
                      {/* Sr. */}
                      <td className="py-3 px-3 text-center text-gray-600 font-semibold text-xs whitespace-nowrap">
                        {startIndex + index + 1}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col min-w-0">
                          <span className={`font-bold text-xs truncate ${(item.category || "").toLowerCase() === "it" ? "text-purple-700" : "text-orange-700"}`}>
                            {item.category || "N/A"}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[140px]">
                            {item.subCategory || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Profile / Designation */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-xs text-purple-700 truncate max-w-[200px]" title={item.profile || item.designation}>
                            {item.profile || item.designation || "N/A"}
                          </span>
                          {isFilled && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full w-fit mt-0.5 shadow-2xs whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              Filled
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 mt-0.5 font-mono truncate">
                            ID: {item.id || item.vacancyId || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* Hiring */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block border px-2.5 py-0.5 rounded text-[11px] font-semibold ${getHiringBadge(
                            item.hiring
                          )}`}
                        >
                          {item.hiring || "N/A"}
                        </span>
                      </td>

                      {/* State */}
                      <td className="py-3 px-3 font-medium text-gray-800 text-xs truncate max-w-[120px]">
                        {item.state && item.state.trim() ? item.state : "N/A"}
                      </td>

                      {/* City */}
                      <td className="py-3 px-3 font-medium text-gray-800 text-xs truncate max-w-[120px]">
                        {(item.location && item.location.trim()) || (item.city && item.city.trim()) || "N/A"}
                      </td>

                      {/* Vacancy */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 text-gray-700 font-bold text-xs">
                          <Users size={13} className="text-gray-400 shrink-0" />
                          <span>
                            {item.candidatesCount !== undefined && item.candidatesCount !== null && item.candidatesCount !== ""
                              ? item.candidatesCount
                              : (item.numberOfVacancies ?? "N/A")}
                          </span>
                        </div>
                      </td>

                      {/* Applied */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1 text-gray-700 font-bold text-xs">
                          <CheckCircle2 size={13} className="text-gray-400 shrink-0" />
                          <span>
                            {item.submittedCount !== undefined && item.submittedCount !== null
                              ? item.submittedCount
                              : (item.applicationSubmittedCount ?? 0)}
                          </span>
                        </div>
                      </td>

                      {/* Work Mode */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={getWorkModeClass(item.workMode)}>
                          {item.workMode || "N/A"}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center gap-1 text-gray-700 font-medium text-[11px] whitespace-nowrap">
                          <Calendar size={12} className="text-purple-400 shrink-0" />
                          {(() => {
                            if (!item.deadline) return "N/A";
                            const d = new Date(item.deadline);
                            if (isNaN(d.getTime())) return item.deadline || "N/A";
                            const day = String(d.getDate()).padStart(2, "0");
                            const month = String(d.getMonth() + 1).padStart(2, "0");
                            const year = d.getFullYear();
                            return `${day}-${month}-${year}`;
                          })()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedJdVacancy(item)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Job Description"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/vacancies/view/${item.id}`)}
                            className="p-1.5 text-gray-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="View Applications"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/vacancies/apply/${item.id}`)}
                            className="p-1.5 bg-[#8931BA] hover:bg-[#7524a1] text-white rounded-lg transition-all shadow-xs hover:shadow-sm cursor-pointer"
                            title="Submit Candidate Details"
                          >
                            <UserCheck size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {filteredVacancies.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-3 px-2 mb-6 text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold text-gray-800">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-gray-800">
                {Math.min(startIndex + itemsPerPage, filteredVacancies.length)}
              </span>{" "}
              of <span className="font-semibold text-gray-800">{filteredVacancies.length}</span> vacancies
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-lg font-semibold text-xs transition-colors ${currentPage === pageNum
                    ? "bg-purple-700 text-white shadow-sm"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* Job Description Modal */}
      {selectedJdVacancy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedJdVacancy.category || "General"}
                  </span>
                  {selectedJdVacancy.subCategory && (
                    <span className="text-purple-200 text-xs font-medium">
                      • {selectedJdVacancy.subCategory}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">
                  {selectedJdVacancy.profile || selectedJdVacancy.designation || "Job Vacancy Details"}
                </h2>
                <p className="text-xs text-purple-200 mt-1 font-mono">
                  ID: {selectedJdVacancy.id || selectedJdVacancy._id || selectedJdVacancy.vacancyId || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setSelectedJdVacancy(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Quick Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/40 p-3.5 rounded-xl border border-purple-100/60 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium text-[10px] uppercase tracking-wider">Location</span>
                  <span className="font-semibold text-gray-800">
                    {(selectedJdVacancy.location && selectedJdVacancy.location.trim()) ||
                      (selectedJdVacancy.city && selectedJdVacancy.city.trim()) ||
                      "N/A"}
                    {selectedJdVacancy.state ? `, ${selectedJdVacancy.state}` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium text-[10px] uppercase tracking-wider">Work Mode</span>
                  <span className={getWorkModeClass(selectedJdVacancy.workMode)}>
                    {selectedJdVacancy.workMode || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium text-[10px] uppercase tracking-wider">Hiring Type</span>
                  <span className="font-semibold text-purple-700">
                    {selectedJdVacancy.hiring || "Internal"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium text-[10px] uppercase tracking-wider">Deadline</span>
                  <span className="font-semibold text-gray-800">
                    {(() => {
                      if (!selectedJdVacancy.deadline) return "N/A";
                      const d = new Date(selectedJdVacancy.deadline);
                      if (isNaN(d.getTime())) return selectedJdVacancy.deadline;
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const year = d.getFullYear();
                      return `${day}-${month}-${year}`;
                    })()}
                  </span>
                </div>
              </div>

              {/* Job Description & Requirements */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <FileText size={16} className="text-purple-600" /> Job Description & Requirements
                </h3>
                <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-line font-sans max-h-[300px] overflow-y-auto">
                  {selectedJdVacancy.description || selectedJdVacancy.jobDescription ? (
                    selectedJdVacancy.description || selectedJdVacancy.jobDescription
                  ) : (
                    <span className="text-gray-400 italic">No detailed job description provided for this vacancy.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center gap-3">
              <button
                onClick={() => setSelectedJdVacancy(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetId = selectedJdVacancy.id || selectedJdVacancy._id;
                  setSelectedJdVacancy(null);
                  navigate(`/vacancies/apply/${targetId}`);
                }}
                className="px-4 py-2 bg-[#8931BA] hover:bg-[#7524a1] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck size={15} /> Submit Candidate Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancyList;
