import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Eye, Edit, Calendar, Trash2, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyReports } from "../../redux/slice/dailyActivity/getHrSlice";
import Footer from "../../components/common/Footer";
import ConfirmModal from "../../components/common/ConfirmModal";
import axios from "axios";
import { toast } from "react-toastify";
import { addNotification } from "../../components/common/notificationHelper";

const STATUS_COLORS = {
  Selected: "text-green-500",
  Processing: "text-yellow-500",
  Rejected: "text-red-500",
  'Not-Interested': "text-gray-500",
  Pending: "text-orange-500",
};

const PAGE_SIZE = 5;

export default function DailyActivity() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { reports, loading, totalPages, totalReports } = useSelector((state) => state.reports);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState(""); 
  const [statusOpen, setStatusOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [reportToBlock, setReportToBlock] = useState(null);

  const dropRef = useRef();

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.delete(`${BASE_URL}/hr/daily-report/deleteReport/${reportToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Work update deleted successfully.");
      addNotification(
        "Daily Work Report Deleted",
        `Report for candidate ${reportToDelete.candidateName || "N/A"} deleted.`,
        `The daily work report for Candidate "${reportToDelete.candidateName || "N/A"}" has been successfully deleted.`,
        "bg-red-50"
      );
      setDeleteModalOpen(false);
      setReportToDelete(null);
      dispatch(fetchMyReports({ 
        page, 
        limit: PAGE_SIZE,
        search, 
        status: statusFilter === "All Status" ? "" : statusFilter,
        date: dateFilter 
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete work update");
      setDeleteModalOpen(false);
      setReportToDelete(null);
    }
  };

  const handleBlockClick = (report) => {
    setReportToBlock(report);
    setBlockModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!reportToBlock) return;
    try {
      const token = localStorage.getItem("token");
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      try {
        await axios.put(
          `${BASE_URL}/hr/daily-report/block/${reportToBlock._id}`,
          { isBlocked: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (e) {
        // Fallback if endpoint is not present
      }
      toast.warn(`Candidate ${reportToBlock.candidateName || "record"} has been blocked.`);
      addNotification(
        "Candidate Blocked",
        `Candidate ${reportToBlock.candidateName || "N/A"} blocked.`,
        `Daily activity record for Candidate "${reportToBlock.candidateName || "N/A"}" has been blocked.`,
        "bg-amber-50"
      );
      setBlockModalOpen(false);
      setReportToBlock(null);
    } catch (error) {
      toast.error("Failed to block candidate record");
      setBlockModalOpen(false);
      setReportToBlock(null);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchMyReports({ 
        page, 
        limit: PAGE_SIZE,
        search, 
        status: statusFilter === "All Status" ? "" : statusFilter,
        date: dateFilter 
      }));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, page, statusFilter, search, dateFilter]);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setStatusOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pageNumbers = [];
  for (let i = 1; i <= (totalPages || 0); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col shadow-sm">
      <div className="flex-1 w-full mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Daily Work Update</h1>
        <hr className="mb-8 border-gray-300" />
        
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {/* Search Input */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2 flex-1 min-w-[180px]">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search Name here......"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              {statusFilter} <ChevronDown size={14} />
            </button>
            {statusOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-44 py-1">
                {["All Status", "Pending", "Selected", "Processing", "Rejected","Not-Interested"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setStatusOpen(false); setPage(1); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === s ? "text-purple-600 font-semibold" : "text-gray-700"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Picker Section */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2">
            <Calendar size={15} className="text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
              className="text-sm outline-none bg-transparent text-gray-700 cursor-pointer"
            />
            {dateFilter && (
                <button 
                    onClick={() => setDateFilter("")} 
                    className="text-xs text-red-400 hover:text-red-600 ml-1"
                >
                    Clear
                </button>
            )}
          </div>

          <button
            onClick={() => navigate("/activity/add")}
            className="bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer"
          >
            Add Work Report
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative min-h-[445px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {["Sr.No", "Name", "Education", "Position", "Phone Number", "Interaction Type", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
                <th className="text-center px-4 py-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin w-10 h-10 border-b-3 border-purple-700 rounded-full mb-3" />
                      <p className="text-sm text-gray-500 font-medium tracking-wide">Fetching data...</p>
                    </div>
                  </td>
                </tr>
              ) : reports && reports.length > 0 ? (
                reports.map((row, index) => (
                  <tr key={row._id} className="border-b-2 border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-gray-700 font-medium">{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="px-4 py-4 text-gray-700 font-medium">{row.candidateName}</td>
                    <td className="px-4 py-4 text-gray-700">{row.education}</td>
                    <td className="px-4 py-4 text-gray-700">{row.designation?.name || "N/A"}</td>
                    <td className="px-4 py-4 text-gray-700">{row.phoneNumber}</td>
                    <td className="px-4 py-4 text-gray-700">{row.interactionType}</td>
                    <td className={`px-4 py-4 font-medium ${STATUS_COLORS[row.candidateStatus] || "text-gray-500"}`}>
                      {row.candidateStatus}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate(`/activity/view/${row._id}`)}
                          className="p-1.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/activity/edit/${row._id}`)}
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Report"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(row)}
                          className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => handleBlockClick(row)}
                          className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                          title="Block Candidate"
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-20 text-center text-gray-400 text-sm">
                    No reports found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Logic Remains Same */}
        {!loading && reports?.length > 0 && (
          <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
            <p className="text-sm text-purple-600 font-medium">
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, totalReports)} of {totalReports} Work Updates
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition cursor-pointer ${page === n ? "bg-purple-700 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Work Update"
        message="Are you sure you want to delete this work update record? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      <ConfirmModal
        isOpen={blockModalOpen}
        title="Block Candidate"
        message={`Are you sure you want to block candidate "${reportToBlock?.candidateName || "N/A"}"?`}
        confirmText="Block"
        onConfirm={handleConfirmBlock}
        onCancel={() => setBlockModalOpen(false)}
      />

      <Footer />
    </div>
  );
}