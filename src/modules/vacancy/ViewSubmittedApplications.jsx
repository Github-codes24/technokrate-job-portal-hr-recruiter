import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Search,
  Trash2,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  Mail,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Users,
  UserCheck,
  PlusCircle,
  Building2,
} from "lucide-react";
import {
  deleteApplication,
  fetchVacancyApplications
} from "../../redux/slice/vacancy/vacancySlice";
import Footer from "../../components/common/Footer";
import ConfirmModal from "../../components/common/ConfirmModal";

const ViewSubmittedApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Params State
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = parseInt(searchParams.get("limit") || "10", 10);
  const searchParam = searchParams.get("search") || "";
  const noticePeriodParam = searchParams.get("noticePeriod") || "";
  const statusParam = searchParams.get("status") || "";
  const stateParam = searchParams.get("state") || "";
  const cityParam = searchParams.get("city") || "";

  // Local Filter Inputs
  const [searchInput, setSearchInput] = useState(searchParam);
  const [selectedNoticePeriod, setSelectedNoticePeriod] = useState(noticePeriodParam);
  const [selectedStatus, setSelectedStatus] = useState(statusParam);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { vacancies, applications, currentVacancy, applicationsPagination, loading } = useSelector(
    (state) => state.vacancy
  );

  // Update URL Query Params helper
  const updateQueryParams = useCallback((newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.keys(newParams).forEach((key) => {
      if (newParams[key] !== undefined && newParams[key] !== null && newParams[key] !== "") {
        updated.set(key, newParams[key]);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  }, [searchParams, setSearchParams]);

  // Sync local inputs when URL params change externally
  useEffect(() => {
    setSearchInput(searchParam);
    setSelectedNoticePeriod(noticePeriodParam);
    setSelectedStatus(statusParam);
  }, [searchParam, noticePeriodParam, statusParam]);

  // Debounce search input (400ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        updateQueryParams({ search: searchInput, page: 1 });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, updateQueryParams]);

  // Fetch applications from API 5 when ID or query parameters change
  const loadApplications = useCallback(() => {
    if (id) {
      dispatch(
        fetchVacancyApplications({
          id,
          params: {
            page: pageParam,
            limit: limitParam,
            search: searchParam,
            noticePeriod: noticePeriodParam,
            status: statusParam,
            state: stateParam,
            city: cityParam,
          },
        })
      );
    }
  }, [dispatch, id, pageParam, limitParam, searchParam, noticePeriodParam, statusParam, stateParam, cityParam]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    updateQueryParams({ search: searchInput, page: 1 });
  };

  const targetVacancy =
    currentVacancy && (currentVacancy.id === id || currentVacancy._id === id || currentVacancy.vacancyId === id)
      ? currentVacancy
      : vacancies.find((v) => v.id === id || v._id === id || v.vacancyId === id) || currentVacancy;

  const vacancyTitle = targetVacancy?.designation || targetVacancy?.profile || `ID: ${id}`;
  const vacancyCategory = targetVacancy?.category || targetVacancy?.department || "IT";
  const vacancySubCategory = targetVacancy?.subCategory || targetVacancy?.subDepartment || "Development";
  const vacancyLocation = targetVacancy?.city
    ? (targetVacancy?.state ? `${targetVacancy.city}, ${targetVacancy.state}` : targetVacancy.city)
    : (targetVacancy?.location || "Mumbai, Maharashtra");
  const vacancyWorkMode = targetVacancy?.workMode || targetVacancy?.jobType || "Remote";
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const rawDeadline = targetVacancy?.deadline || "2026-10-15";
  const formattedDeadline = formatDateToDDMMYYYY(rawDeadline);

  const openDeleteModal = (appId) => {
    setDeleteId(appId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      dispatch(deleteApplication(deleteId));
      setDeleteId(null);
      setIsDeleteModalOpen(false);
    }
  };

  const paginationInfo = applicationsPagination || {
    currentPage: pageParam,
    limit: limitParam,
    total: applications.length,
    totalPages: Math.ceil(applications.length / limitParam) || 1,
    hasNextPage: pageParam < Math.ceil(applications.length / limitParam),
    hasPrevPage: pageParam > 1,
  };

  const openingsCount = Number(targetVacancy?.candidatesCount || targetVacancy?.numberOfVacancies || 0);
  const appliedCount = Number(targetVacancy?.submittedCount ?? targetVacancy?.applicationSubmittedCount ?? paginationInfo.total ?? applications.length ?? 0);
  const isVacancyFilled = openingsCount > 0 && appliedCount >= openingsCount;

  const startIndex = (paginationInfo.currentPage - 1) * paginationInfo.limit;
  const endIndex = Math.min(startIndex + paginationInfo.limit, paginationInfo.total || applications.length);

  const getNoticePeriodBadge = (period) => {
    switch (period) {
      case "Immediate Joiner":
      case "Immediate":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "15 Days":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "30 Days":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "60 Days":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "90 Days":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-purple-50 text-purple-700 border-purple-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "shortlisted":
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "submitted":
      case "pending":
      default:
        return "bg-purple-50 text-purple-700 border-purple-200";
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans flex flex-col justify-between">
      <div>
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/vacancies")}
              className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full transition-colors cursor-pointer shrink-0"
              title="Back to Vacancies"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Submitted Applications</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Candidate applications for vacancy position:{" "}
                <span className="font-semibold text-purple-700">{vacancyTitle}</span>
              </p>
            </div>
          </div>

          <button
            onClick={loadApplications}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs border border-gray-200 self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-purple-600" : "text-purple-600"} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Target Vacancy Info Header Banner */}
        {targetVacancy && (
          <div className="bg-gradient-to-r from-purple-50 via-purple-50/80 to-indigo-50/50 border border-purple-200 p-5 rounded-2xl mb-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8931BA]">Target Vacancy</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white text-purple-900 rounded border border-purple-200">
                  #{targetVacancy.vacancyId || targetVacancy.id || targetVacancy._id}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-purple-950 flex items-center gap-3 flex-wrap">
                <span>{vacancyTitle}</span>
                {isVacancyFilled && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Filled
                  </span>
                )}
              </h2>
              <p className="text-xs font-semibold mt-1 flex items-center gap-2">
                <span className="font-bold text-purple-700">{vacancyCategory}</span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500">{vacancySubCategory}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-gray-700 w-full md:w-auto">
              <span className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1.5 rounded-xl shadow-xs text-purple-900">
                <Users size={14} className="text-[#8931BA]" />
                <span>Openings: <strong>{openingsCount || 1}</strong></span>
              </span>

              <span className={`flex items-center gap-1.5 bg-white border px-3 py-1.5 rounded-xl shadow-xs ${isVacancyFilled ? "border-red-200 text-red-700" : "border-purple-200 text-purple-900"}`}>
                <UserCheck size={14} className={isVacancyFilled ? "text-red-500" : "text-[#8931BA]"} />
                <span>Applied: <strong>{appliedCount}</strong></span>
              </span>

              <span className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1.5 rounded-xl shadow-xs text-purple-900">
                <Building2 size={14} className="text-[#8931BA]" />
                <span>Hiring: <strong>{targetVacancy.hiring || "N/A"}</strong></span>
              </span>

              <span className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1.5 rounded-xl shadow-xs text-gray-700">
                <MapPin size={14} className="text-purple-600" /> {vacancyLocation}
              </span>

              <span className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1.5 rounded-xl shadow-xs text-gray-700">
                <Briefcase size={14} className="text-purple-600" /> {vacancyWorkMode}
              </span>

              <span className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1.5 rounded-xl shadow-xs text-gray-700">
                <Calendar size={14} className="text-purple-600" /> Deadline: {formattedDeadline}
              </span>

              <button
                onClick={() => navigate(`/vacancies/apply/${targetVacancy.id || targetVacancy._id || id}`)}
                className="px-3.5 py-1.5 bg-[#8931BA] hover:bg-[#7726a5] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto md:ml-0"
              >
                <PlusCircle size={14} /> Submit Candidate
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter Controls Bar with Debounced Search */}
        <div className="bg-gray-50/70 border border-gray-100 p-4 rounded-xl mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by candidate name, email, phone, organization..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-purple-500" />
          </form>

          <div className="flex flex-wrap items-center gap-4">
            {/* Notice Period Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Filter size={14} className="text-purple-600" /> Notice Period:
              </span>
              <select
                value={selectedNoticePeriod}
                onChange={(e) => {
                  setSelectedNoticePeriod(e.target.value);
                  updateQueryParams({ noticePeriod: e.target.value, page: 1 });
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700 cursor-pointer"
              >
                <option value="">All Notice Periods</option>
                <option value="Immediate Joiner">Immediate Joiner</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  updateQueryParams({ status: e.target.value, page: 1 });
                }}
                className="px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-4 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#8931BA] text-white">
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Sr.</th>
                <th className="py-3 px-3 font-semibold text-left text-xs tracking-wide whitespace-nowrap">Candidate Name</th>
                <th className="py-3 px-3 font-semibold text-left text-xs tracking-wide whitespace-nowrap">Contact Info</th>
                <th className="py-3 px-3 font-semibold text-left text-xs tracking-wide whitespace-nowrap">Experience & Org</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Notice Period</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Status</th>
                <th className="py-3 px-3 font-semibold text-left text-xs tracking-wide whitespace-nowrap">City</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">CV Link</th>
                <th className="py-3 px-3 font-semibold text-center text-xs tracking-wide whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-purple-700 font-medium text-xs">
                    Loading submitted applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-400 font-medium text-xs">
                    No submitted applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app, index) => {
                  const serialNo = startIndex + index + 1;
                  return (
                    <tr key={app.id || index} className="hover:bg-purple-50/30 transition-colors border-b border-gray-100">
                      {/* SR. */}
                      <td className="py-3 px-3 text-center text-gray-600 font-semibold text-xs whitespace-nowrap">
                        {serialNo}
                      </td>

                      {/* CANDIDATE NAME */}
                      <td className="py-3 px-3 max-w-[200px]">
                        <div className="font-semibold text-xs text-purple-700 leading-snug break-words">
                          {app.fullName || "N/A"}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                          ID: {app.applicationId || app.id || "APP"}
                        </div>
                      </td>

                      {/* CONTACT INFO */}
                      <td className="py-3 px-3 max-w-[220px]">
                        {app.email ? (
                          <a
                            href={`mailto:${app.email}`}
                            className="font-medium text-xs text-purple-700 hover:underline block break-all mb-0.5"
                            title={app.email}
                          >
                            {app.email}
                          </a>
                        ) : (
                          <div className="text-gray-400 text-xs mb-0.5">N/A</div>
                        )}
                        <div className="text-[11px] text-gray-600 font-mono font-medium whitespace-nowrap">
                          {app.phone || "N/A"}
                        </div>
                      </td>

                      {/* EXPERIENCE & ORG */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-xs text-gray-800 whitespace-nowrap">
                          {app.experience || app.totalExperience
                            ? `${app.experience || app.totalExperience} Yrs Exp`
                            : "N/A"}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium mt-0.5 break-words max-w-[190px]">
                          {app.currentCompany || app.currentOrganization || "N/A"}
                        </div>
                      </td>

                      {/* NOTICE PERIOD */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block border px-2.5 py-0.5 rounded text-[11px] font-semibold ${getNoticePeriodBadge(app.noticePeriod)}`}>
                          {app.noticePeriod || "N/A"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block border px-2.5 py-0.5 rounded text-[11px] font-semibold capitalize ${getStatusBadge(app.status)}`}>
                          {app.status || "submitted"}
                        </span>
                      </td>

                      {/* LOCATION / CITY */}
                      <td className="py-3 px-3 font-medium text-gray-800 text-xs truncate max-w-[130px]">
                        {app.city ? (
                          app.state ? `${app.city}, ${app.state}` : app.city
                        ) : (
                          app.location || "N/A"
                        )}
                      </td>

                      {/* CV LINK */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {app.cvDriveLink || app.resumeLink ? (
                          <a
                            href={app.cvDriveLink || app.resumeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-700 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors inline-flex items-center justify-center gap-1 border border-gray-200 whitespace-nowrap shadow-2xs"
                          >
                            <ExternalLink size={12} className="text-purple-600 shrink-0" /> View CV
                          </a>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-medium">N/A</span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/vacancies/application-details/${app.id}`)}
                            className="p-1.5 text-gray-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                            title="View Application Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(app.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 size={16} />
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

        {/* Pagination Section (Matching VacancyList exact style) */}
        {(paginationInfo.total > 0 || applications.length > 0) && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-3 px-2 mb-6 text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold text-gray-800">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-gray-800">
                {endIndex}
              </span>{" "}
              of <span className="font-semibold text-gray-800">{paginationInfo.total || applications.length}</span> applications
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQueryParams({ page: paginationInfo.currentPage - 1 })}
                disabled={!paginationInfo.hasPrevPage && paginationInfo.currentPage <= 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: paginationInfo.totalPages || 1 }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => updateQueryParams({ page: pageNum })}
                  className={`w-9 h-9 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${paginationInfo.currentPage === pageNum
                    ? "bg-purple-700 text-white shadow-sm"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => updateQueryParams({ page: paginationInfo.currentPage + 1 })}
                disabled={!paginationInfo.hasNextPage && paginationInfo.currentPage >= paginationInfo.totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Application"
        message="Are you sure you want to delete this submitted application? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default ViewSubmittedApplications;
