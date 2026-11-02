import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Search, Eye, Edit, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../../components/common/notificationHelper";
import CandidateAssignHeader from "../../components/common/CandidateAssignHeader";
import CandidateAssignPageView from "../../components/common/CandidateAssignPageView";

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE_URL = RAW_BASE_URL.replace(/\/api\/?$/, "");
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
};

const AssignedCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modals / Page View state
  const [selectedCandidateForPageView, setSelectedCandidateForPageView] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [candidateToView, setCandidateToView] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    mailId: "",
    mobileNo: "",
    education: "",
    assignedStatus: "Processing",
    city: "",
    state: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAssigned();
  }, [currentPage, pageSize, searchQuery]);

  const fetchAssigned = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/hr/candidate-database/assigned-candidates?page=${currentPage}&limit=${pageSize}&search=${encodeURIComponent(searchQuery)}`,
        getAuthHeader()
      );
      if (res.data?.success) {
        const dataList = res.data.data || [];
        setCandidates(dataList);
        
        // Extract total & calculate totalPages from response metadata or array length
        const totalCount = res.data.total || res.data.totalCandidates || res.data.count || dataList.length;
        setTotalItems(totalCount);
        const calculatedPages = res.data.totalPages || Math.max(1, Math.ceil(totalCount / pageSize));
        setTotalPages(calculatedPages);
      } else {
        setError(res.data?.message || "Failed to fetch assigned candidates");
        toast.error(res.data?.message || "Failed to fetch assigned candidates");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Network error";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (candidate) => {
    setSelectedCandidateForPageView(candidate);
  };

  const handleEditClick = (candidate) => {
    setCandidateToEdit(candidate);
    setEditForm({
      name: candidate.name || "",
      mailId: candidate.mailId || candidate.email || candidate.mail || "",
      mobileNo: candidate.mobileNo || candidate.phone || candidate.phoneNumber || "",
      education: candidate.education || candidate.highestEducation || candidate.degree || "",
      assignedStatus: candidate.assignedStatus || candidate.status || "Processing",
      city: candidate.city || candidate.location?.city || "",
      state: candidate.state || candidate.location?.state || "",
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!candidateToEdit) return;

    setUpdating(true);
    try {
      const payload = {
        name: editForm.name,
        mailId: editForm.mailId,
        mobileNo: editForm.mobileNo,
        education: editForm.education,
        city: editForm.city,
        state: editForm.state,
        assignedStatus: editForm.assignedStatus,
        status: editForm.assignedStatus,
      };

      const res = await axios.put(
        `${BASE_URL}/api/hr/candidate-database/assigned-candidates/${candidateToEdit._id}`,
        payload,
        getAuthHeader()
      );

      const updatedCandidate = res.data?.data || res.data || {};

      // Update local state list
      setCandidates((prev) =>
        prev.map((c) =>
          c._id === candidateToEdit._id
            ? {
                ...c,
                ...updatedCandidate,
                name: payload.name,
                mailId: payload.mailId,
                mobileNo: payload.mobileNo,
                education: payload.education,
                assignedStatus: payload.assignedStatus,
                status: payload.assignedStatus,
                city: payload.city,
                state: payload.state,
                location: {
                  ...(c.location || {}),
                  city: payload.city,
                  state: payload.state,
                },
              }
            : c
        )
      );

      toast.success(res.data?.message || "Assigned candidate updated successfully.");
      addNotification(
        "Candidate Updated",
        `Details for ${editForm.name} updated.`,
        `Assigned candidate record for "${editForm.name}" has been updated. Status: "${editForm.assignedStatus}".`,
        "bg-blue-50"
      );
      setEditModalOpen(false);
      setCandidateToEdit(null);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to update candidate record";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  // Client side fallback search filtering if backend search isn't filtered
  const filteredCandidates = candidates.filter((c) => {
    if (!searchQuery || searchQuery.trim() === "") return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.mailId && c.mailId.toLowerCase().includes(q)) ||
      (c.mobileNo && c.mobileNo.toLowerCase().includes(q)) ||
      (c.category?.name && c.category.name.toLowerCase().includes(q)) ||
      (c.subCategory?.name && c.subCategory.name.toLowerCase().includes(q)) ||
      (c.designation?.name && c.designation.name.toLowerCase().includes(q))
    );
  });

  if (selectedCandidateForPageView) {
    return (
      <CandidateAssignPageView
        candidate={selectedCandidateForPageView}
        onBack={() => setSelectedCandidateForPageView(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Assigned Candidates</h2>
        
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search assigned candidates..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-700"
            />
          </div>

          {/* Rows Per Page Selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg shadow-sm border border-gray-100 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Sr.</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Name</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Email</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Mobile</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Education</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Location</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Status</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Assigned At</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Category</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Sub Category</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500">Designation</th>
                <th className="px-4 py-3 text-sm font-bold text-gray-500 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin w-10 h-10 border-b-3 border-purple-700 rounded-full mb-3" />
                      <p className="text-sm text-gray-500 font-medium tracking-wide">Fetching assigned candidates...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCandidates?.length > 0 ? (
                filteredCandidates.map((c, idx) => (
                  <tr key={c._id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{c.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.mailId || c.email || c.mail || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.mobileNo || c.phone || c.phoneNumber || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.education || c.highestEducation || c.degree || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {(c.city || c.state)
                        ? `${c.city || ""}${c.city && c.state ? ", " : ""}${c.state || ""}`
                        : (c.location?.city ? `${c.location.city}${c.location?.state ? `, ${c.location.state}` : ""}` : (c.location?.state || "-"))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        (c.assignedStatus || c.status) === "Selected" ? "bg-green-100 text-green-700" :
                        (c.assignedStatus || c.status) === "Processing" ? "bg-yellow-100 text-yellow-700" :
                        (c.assignedStatus || c.status) === "Rejected" ? "bg-red-100 text-red-700" :
                        (c.assignedStatus || c.status) === "Not-Interested" ? "bg-rose-100 text-rose-700" :
                        (c.assignedStatus || c.status) === "Onboarding" ? "bg-blue-100 text-blue-700" :
                        (c.assignedStatus || c.status) === "On Hold" ? "bg-orange-100 text-orange-700" :
                        (c.assignedStatus || c.status) === "Today Joining" ? "bg-emerald-100 text-emerald-800 font-bold" :
                        (c.assignedStatus || c.status) === "Tomorrow Joining" ? "bg-teal-100 text-teal-800 font-semibold" :
                        (c.assignedStatus || c.status) === "In Week Joining" ? "bg-cyan-100 text-cyan-800 font-semibold" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {c.assignedStatus || c.status || "Processing"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(c.assignedAt || c.transferredAt || c.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.category?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.subCategory?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.designation?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewClick(c)}
                          className="p-1.5 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditClick(c)}
                          className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Edit Candidate"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-6 py-16 text-center text-gray-400">No assigned candidates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!loading && filteredCandidates.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-purple-600 font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems || filteredCandidates.length)} of {totalItems || filteredCandidates.length} Assigned Candidates
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages || 1)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-purple-700 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage >= (totalPages || 1)}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">{error}</div>
      )}



      {/* EDIT MODAL */}
      {editModalOpen && candidateToEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Edit Assigned Candidate</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.mailId}
                    onChange={(e) => setEditForm({ ...editForm, mailId: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile</label>
                  <input
                    type="text"
                    required
                    value={editForm.mobileNo}
                    onChange={(e) => setEditForm({ ...editForm, mobileNo: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Education</label>
                <input
                  type="text"
                  value={editForm.education}
                  onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                  placeholder="Enter education"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Assigned Status</label>
                <input
                  type="text"
                  list="status-suggestions"
                  placeholder="Type custom status or select option..."
                  value={editForm.assignedStatus}
                  onChange={(e) => setEditForm({ ...editForm, assignedStatus: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                />
                <datalist id="status-suggestions">
                  <option value="Processing" />
                  <option value="Selected" />
                  <option value="Rejected" />
                  <option value="Not-Interested" />
                  <option value="Onboarding" />
                  <option value="On Hold" />
                  <option value="Today Joining" />
                  <option value="Tomorrow Joining" />
                  <option value="In Week Joining" />
                </datalist>

                {/* Quick Selection Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    "Processing",
                    "Selected",
                    "Rejected",
                    "Not-Interested",
                    "Onboarding",
                    "On Hold",
                    "Today Joining",
                    "Tomorrow Joining",
                    "In Week Joining",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, assignedStatus: opt })}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer border transition-colors ${
                        editForm.assignedStatus === opt
                          ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                          : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedCandidates;

