import React from "react";
import { Layers, Briefcase, Calendar } from "lucide-react";

const formatDateOnly = (iso) => {
  if (!iso) return "09/05/2026";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return iso;
  }
};

const CandidateAssignHeader = ({
  category = "IT",
  subCategory = "DevOps & Cloud",
  designation = "DevOps Intern",
  uploadDate = "09/05/2026",
  status = "Accepted",
}) => {
  const displayDate =
    typeof uploadDate === "string" && uploadDate.includes("/")
      ? uploadDate
      : formatDateOnly(uploadDate);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between flex-wrap gap-4 w-full">
      <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
        {/* Category */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Category</p>
            <p className="text-sm font-bold text-gray-900">{category}</p>
          </div>
        </div>

        {/* Subcategory */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Subcategory</p>
            <p className="text-sm font-bold text-gray-900">{subCategory}</p>
          </div>
        </div>

        {/* Designation */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Designation</p>
            <p className="text-sm font-bold text-gray-900">{designation}</p>
          </div>
        </div>

        {/* Upload Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">Upload Date</p>
            <p className="text-sm font-bold text-gray-900">{displayDate}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CandidateAssignHeader;
