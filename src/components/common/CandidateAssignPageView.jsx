import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit, Trash2, Loader2, FileSpreadsheet, X } from "lucide-react";
import CandidateAssignHeader from "./CandidateAssignHeader";
import { toast } from "react-toastify";
import { addNotification } from "./notificationHelper";
import * as XLSX from "xlsx";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const resolveFileUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }
  const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
};

const getFileUrlFromCandidate = (cand) => {
  if (!cand) return "";
  return (
    cand.fileUrl ||
    cand.file_url ||
    cand.filePath ||
    cand.file_path ||
    cand.excelUrl ||
    cand.excel_url ||
    cand.excelFile ||
    cand.excel_file ||
    cand.documentUrl ||
    cand.url ||
    cand.file ||
    cand.resumeUrl ||
    cand.data?.fileUrl ||
    cand.data?.excelUrl ||
    ""
  );
};

const extractRawRowsFromCandidate = (cand) => {
  if (!cand) return [];
  if (Array.isArray(cand)) return cand;

  const possibleProps = [
    "excelData",
    "excel_data",
    "excelRows",
    "excel_rows",
    "candidates",
    "candidateList",
    "candidate_list",
    "candidatesList",
    "candidateData",
    "candidate_data",
    "candidatesData",
    "data",
    "records",
    "rows",
    "jsonRows",
    "json_rows",
    "fileData",
    "file_data",
    "parsedData",
    "parsed_data",
    "details",
    "candidateDetails",
    "candidate_details",
    "assignedCandidates",
    "assigned_candidates",
    "uploadedCandidates",
    "uploaded_candidates",
    "rawRows",
    "raw_rows",
    "items",
    "list",
  ];

  for (const p of possibleProps) {
    if (cand[p]) {
      if (Array.isArray(cand[p]) && cand[p].length > 0) return cand[p];
      if (typeof cand[p] === "string") {
        try {
          const parsed = JSON.parse(cand[p]);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          // ignore error
        }
      }
    }
  }

  // Check nested cand.data object
  if (cand.data && typeof cand.data === "object" && !Array.isArray(cand.data)) {
    return extractRawRowsFromCandidate(cand.data);
  }

  return [];
};

const isSingleCandidateObject = (cand) => {
  if (!cand || typeof cand !== "object") return false;
  return Boolean(
    cand.name ||
      cand.candidateName ||
      cand.fullName ||
      cand.mailId ||
      cand.email ||
      cand.mobileNo ||
      cand.contact ||
      cand.phone
  );
};

const parseExcelJsonToCandidates = (rawRows, candidateMeta) => {
  if (!Array.isArray(rawRows) || rawRows.length === 0) return [];

  return rawRows.map((item, idx) => {
    const getKey = (possibleKeys) => {
      for (const k of possibleKeys) {
        if (item[k] !== undefined && item[k] !== null && item[k] !== "") {
          return String(item[k]).trim();
        }
        const targetClean = k.toLowerCase().replace(/[^a-z0-9]/g, "");
        const found = Object.keys(item).find(
          (ik) => ik.toLowerCase().replace(/[^a-z0-9]/g, "") === targetClean
        );
        if (found && item[found] !== undefined && item[found] !== null && item[found] !== "") {
          return String(item[found]).trim();
        }
      }
      return "";
    };

    const name =
      getKey([
        "Full Name",
        "FullName",
        "Name",
        "Candidate Name",
        "CANDIDATE NAME",
        "CandidateName",
        "candidateName",
        "candidate_name",
        "name",
        "fullName",
      ]) || `Candidate ${idx + 1}`;

    const email =
      getKey([
        "Email",
        "Email Address",
        "EmailID",
        "Email ID",
        "Mail",
        "Mail ID",
        "MailID",
        "mailId",
        "mail_id",
        "email",
      ]) || "-";

    const contact =
      getKey([
        "Mobile No.",
        "Mobile No",
        "Mobile",
        "Contact",
        "Contact No",
        "Contact No.",
        "Phone",
        "Phone Number",
        "MobileNumber",
        "mobileNo",
        "mobile_no",
        "contact",
        "phone",
      ]) || "-";

    const technology =
      getKey([
        "Technology",
        "Tech",
        "Key Skills",
        "KeySkills",
        "Skills",
        "Skill",
        "Role",
        "Designation",
        "technology",
        "skills",
      ]) ||
      candidateMeta?.designation?.name ||
      candidateMeta?.subCategory?.name ||
      "IT";

    const city =
      getKey(["Location", "City", "Place", "Address", "city", "location"]) ||
      candidateMeta?.location?.city ||
      candidateMeta?.city ||
      "Pune";

    const state =
      getKey(["State", "Region", "state"]) ||
      candidateMeta?.location?.state ||
      candidateMeta?.state ||
      "Maharashtra";

    const status =
      getKey(["Status", "Candidate Status", "status"]) ||
      candidateMeta?.status ||
      "Pending";

    const workMode =
      getKey(["work mode", "Work Mode", "WorkMode", "Mode", "Type", "workMode", "work_mode"]) ||
      candidateMeta?.workMode ||
      "Remote";

    return {
      id: idx + 1,
      name,
      email,
      contact,
      technology,
      city,
      state,
      status,
      workMode,
      rawItem: item,
    };
  });
};

const CandidateAssignPageView = ({ candidate, onBack }) => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [candidatesList, setCandidatesList] = useState([]);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [fetchedMeta, setFetchedMeta] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    contact: "",
    technology: "",
    city: "",
    state: "",
    workMode: "Remote",
  });

  const candidateId = candidate?._id || candidate?.id || routeId;

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const loadCandidateData = async () => {
      // 1. Try fetching from backend API GET /api/hr/candidate-database/getCandidateDatabaseById/:id if target ID is present
      if (candidateId) {
        setLoadingExcel(true);
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${BASE_URL}/api/hr/candidate-database/getCandidateDatabaseById/${candidateId}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          if (res.data?.success && res.data?.data) {
            const apiData = res.data.data;
            if (isSubscribed) {
              setFetchedMeta(apiData);
            }
            const apiRows = extractRawRowsFromCandidate(apiData);
            if (apiRows && apiRows.length > 0) {
              if (isSubscribed) {
                setCandidatesList(
                  parseExcelJsonToCandidates(apiRows, { ...candidate, ...apiData })
                );
                setLoadingExcel(false);
              }
              return;
            }
          }
        } catch (err) {
          console.warn("Could not fetch candidate database by id from API:", err);
        }
      }

      // 2. Direct array in candidate prop object
      const directRows = extractRawRowsFromCandidate(candidate);
      if (directRows && directRows.length > 0) {
        if (isSubscribed) {
          setCandidatesList(parseExcelJsonToCandidates(directRows, candidate));
          setLoadingExcel(false);
        }
        return;
      }

      // 3. File URL download and parse
      const fileUrlCandidate = getFileUrlFromCandidate(candidate);
      if (fileUrlCandidate) {
        if (isSubscribed) setLoadingExcel(true);
        const fullUrl = resolveFileUrl(fileUrlCandidate);
        const token = localStorage.getItem("token");

        try {
          const res = await fetch(fullUrl, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`);
          const buffer = await res.arrayBuffer();
          const workbook = XLSX.read(buffer, { type: "array" });
          let rawRows = [];
          for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet);
            if (rows && rows.length > 0) {
              rawRows = rows;
              break;
            }
          }

          if (rawRows && rawRows.length > 0) {
            if (isSubscribed) setCandidatesList(parseExcelJsonToCandidates(rawRows, candidate));
          } else {
            if (isSubscribed) setCandidatesList([]);
          }
        } catch (err) {
          console.warn("Could not parse excel fileUrl, fallback to candidate item:", err);
          if (isSingleCandidateObject(candidate) || candidate?.category?.name) {
            if (isSubscribed) setCandidatesList(parseExcelJsonToCandidates([candidate], candidate));
          } else {
            if (isSubscribed) setCandidatesList([]);
          }
        } finally {
          if (isSubscribed) setLoadingExcel(false);
        }
        return;
      }

      // 4. Single candidate fallback
      if (isSingleCandidateObject(candidate)) {
        if (isSubscribed) setCandidatesList(parseExcelJsonToCandidates([candidate], candidate));
      } else {
        if (isSubscribed) setCandidatesList([]);
      }
      if (isSubscribed) setLoadingExcel(false);
    };

    loadCandidateData();

    return () => {
      isSubscribed = false;
    };
  }, [candidate, candidateId]);

  const handleDeleteRow = (person) => {
    setCandidatesList((prev) => prev.filter((c) => c.id !== person.id));
    toast.info(`Candidate ${person.name} removed.`);
  };

  const handleEditClick = (person) => {
    setEditingCandidate(person);
    setEditForm({
      name: person.name || "",
      email: person.email || "",
      contact: person.contact || "",
      technology: person.technology || "",
      city: person.city || "",
      state: person.state || "",
      workMode: person.workMode || "Remote",
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingCandidate) {
      setCandidatesList((prev) =>
        prev.map((c) =>
          c.id === editingCandidate.id ? { ...c, ...editForm } : c
        )
      );
      toast.success(`Candidate ${editForm.name} updated successfully!`);
      addNotification(
        "Candidate Record Updated",
        `Updated details for ${editForm.name}.`,
        `Candidate ${editForm.name} details updated in View section.`,
        "bg-blue-50"
      );
    }
    setEditModalOpen(false);
    setEditingCandidate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 font-sans space-y-6">
      {/* 1. TOP HEADER BAR FROM USER SCREENSHOT */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {/* Round Back Arrow Button */}
          <button
            onClick={handleBackClick}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shadow-2xs"
            title="Back to Database"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Icon + Title + Subtitle */}
          <div className="flex items-center gap-2.5">
            <div className="text-purple-600 shrink-0">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                Candidate Database Details
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Viewing candidate database uploaded in Excel format
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY / SUBCATEGORY / DESIGNATION / UPLOAD DATE HEADER BAR */}
      <CandidateAssignHeader
        category={
          fetchedMeta?.category?.name ||
          candidate?.category?.name ||
          (typeof fetchedMeta?.category === "string" ? fetchedMeta.category : "IT")
        }
        subCategory={
          fetchedMeta?.subCategory?.name ||
          candidate?.subCategory?.name ||
          (typeof fetchedMeta?.subCategory === "string" ? fetchedMeta.subCategory : "DevOps & Cloud")
        }
        designation={
          fetchedMeta?.designation?.name ||
          candidate?.designation?.name ||
          (typeof fetchedMeta?.designation === "string" ? fetchedMeta.designation : "DevOps Intern")
        }
        uploadDate={
          fetchedMeta?.createdAt ||
          candidate?.createdAt ||
          candidate?.uploadDate ||
          candidate?.assignedAt ||
          "09/05/2026"
        }
      />

      {/* 3. CANDIDATES TABLE CARD */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-base font-bold text-gray-800">Uploaded Candidates List</h3>
          <div className="text-sm font-medium text-gray-600">
            Total Records:{" "}
            <span className="font-bold text-purple-700 text-base">
              {candidatesList.length}
            </span>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 min-h-[300px]">
          {loadingExcel ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-purple-600" size={32} />
              <p className="text-sm text-gray-500 font-medium">Parsing Excel sheet data...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#F9F5FF] border-b border-purple-100">
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    SR. NO.
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    CONTACT
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    TECHNOLOGY
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    CITY
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    STATE
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider">
                    WORK MODE
                  </th>
                  <th className="px-4 py-3.5 text-xs font-bold text-purple-900 uppercase tracking-wider text-center">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {candidatesList.length > 0 ? (
                  candidatesList.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-purple-50/30 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-gray-500 font-medium text-center">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-800">
                        {row.name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{row.email}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.contact}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-800">
                        {row.technology}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{row.city}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.state}</td>
                      <td className="px-4 py-3.5 text-gray-700 font-medium">
                        {row.workMode}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(row)}
                            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Candidate"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row)}
                            className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Delete Candidate"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-12 text-center text-gray-400 font-medium"
                    >
                      No candidate records found in Excel sheet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* EDIT CANDIDATE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Edit Candidate Details</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    required
                    value={editForm.contact}
                    onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                <input
                  type="text"
                  required
                  value={editForm.technology}
                  onChange={(e) => setEditForm({ ...editForm, technology: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                <select
                  value={editForm.workMode}
                  onChange={(e) => setEditForm({ ...editForm, workMode: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateAssignPageView;
