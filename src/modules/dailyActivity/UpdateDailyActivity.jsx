import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { 
  fetchCategories, 
  fetchInteractionTypes, 
  fetchStatuses,
  fetchSubCategories,
  fetchDesignations 
} from "../../redux/slice/dailyActivity/getDropdown";
import { fetchReportById, updateDailyReport, resetUpdateStatus } from "../../redux/slice/dailyActivity/updateReportSlice";
import Footer from "../../components/common/Footer";
import { toast } from "react-toastify";
import { addNotification } from "../../components/common/notificationHelper";

export default function UpdateDailyActivity() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, interactions, statuses, subCategories, designations } = useSelector((state) => state.dropdown);
  const { reportData, loading, updating, success } = useSelector((state) => state.updateReport);

  const [formData, setFormData] = useState({
    candidateName: "",
    // position: "",
    category: "",
    subCategory: "",
    designation: "",
    education: "",
    phoneNumber: "",
    email: "",
    interactionType: "",
    candidateStatus: "",
    additionalNotes: "",
    skills: [],
    skillInput: "",
  });
  const [submittedReportInfo, setSubmittedReportInfo] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchInteractionTypes());
    dispatch(fetchStatuses());
    if (id) dispatch(fetchReportById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (reportData) {
      let phone = reportData.phoneNumber || "";
      if (phone.startsWith("+91")) {
        phone = phone.substring(3);
      } else if (phone.startsWith("91") && phone.length > 10) {
        phone = phone.substring(2);
      }
      phone = phone.replace(/\D/g, "");

      setFormData({
        ...reportData,
        phoneNumber: phone,
        skillInput: "",
        category: reportData.category?._id || reportData.category,
        subCategory: reportData.subCategory?._id || reportData.subCategory,
        designation: reportData.designation?._id || reportData.designation,
      });

      if (reportData.category) {
        dispatch(fetchSubCategories({ categoryId: reportData.category?._id || reportData.category, rowId: "update-row" }));
      }
      if (reportData.subCategory) {
        dispatch(fetchDesignations({ subCategoryId: reportData.subCategory?._id || reportData.subCategory, rowId: "update-row" }));
      }
    }
  }, [reportData, dispatch]);

  // 3. Success Handler
  useEffect(() => {
    if (success) {
      if (submittedReportInfo) {
        addNotification(
          "Daily Work Report Updated",
          `Report for candidate ${submittedReportInfo.candidateName} updated.`,
          `Daily work report for Candidate "${submittedReportInfo.candidateName}" has been successfully updated. Category: "${submittedReportInfo.categoryName}", Sub-Category: "${submittedReportInfo.subCategoryName}", Designation: "${submittedReportInfo.designationName}".`,
          "bg-blue-50"
        );
        setSubmittedReportInfo(null);
      }
      dispatch(resetUpdateStatus());
      navigate("/activity");
    }
  }, [success, navigate, dispatch, submittedReportInfo]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (catId) => {
    updateField("category", catId);
    updateField("subCategory", "");
    updateField("designation", "");
    if (catId) dispatch(fetchSubCategories({ categoryId: catId, rowId: "update-row" }));
  };

  const handleSubCategoryChange = (subCatId) => {
    updateField("subCategory", subCatId);
    updateField("designation", "");
    if (subCatId) dispatch(fetchDesignations({ subCategoryId: subCatId, rowId: "update-row" }));
  };

  const handleSubmit = () => {
    if (!formData.candidateName?.trim()) {
      toast.error("Candidate Name is required");
      return;
    }
    if (formData.candidateName.length > 50) {
      toast.error("Candidate Name must be at most 50 characters long");
      return;
    }
    if (!/^[a-zA-Z\s.]+$/.test(formData.candidateName)) {
      toast.error("Candidate Name can only contain alphabetic characters, spaces, and dots");
      return;
    }

    if (!formData.email?.trim()) {
      toast.error("Email Address is required");
      return;
    }
    if (formData.email.length > 100) {
      toast.error("Email Address must be at most 100 characters long");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    if (!formData.subCategory) {
      toast.error("Role (Sub-Category) is required");
      return;
    }

    if (!formData.designation) {
      toast.error("Designation is required");
      return;
    }

    if (!formData.education?.trim()) {
      toast.error("Education is required");
      return;
    }
    if (formData.education.length > 50) {
      toast.error("Education must be at most 50 characters long");
      return;
    }
    const eduRegex = /^[a-zA-Z0-9\s.,()\-]+$/;
    if (!eduRegex.test(formData.education)) {
      toast.error("Education can only contain letters, numbers, spaces, dots, commas, hyphens, and parentheses");
      return;
    }

    if (!formData.phoneNumber?.trim()) {
      toast.error("Phone Number is required");
      return;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error("Phone Number must contain exactly 10 digits");
      return;
    }
    if (formData.phoneNumber.startsWith("00")) {
      toast.error("Phone Number cannot start with '00'");
      return;
    }

    if (!formData.interactionType) {
      toast.error("Interaction Type is required");
      return;
    }

    if (!formData.candidateStatus) {
      toast.error("Candidate Status is required");
      return;
    }

    const payload = {
      ...formData,
      phoneNumber: formData.phoneNumber.startsWith("+91")
        ? formData.phoneNumber
        : `+91${formData.phoneNumber}`,
    };

    setSubmittedReportInfo({
      candidateName: formData.candidateName,
      categoryName: categories.find(c => c._id === formData.category)?.name || "N/A",
      subCategoryName: subCategories["update-row"]?.find(s => s._id === formData.subCategory)?.name || "N/A",
      designationName: designations["update-row"]?.find(d => d._id === formData.designation)?.name || "N/A",
    });

    dispatch(updateDailyReport({ id, payload }));
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300 bg-white";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  if (loading) return <div className="flex flex-col justify-center items-center h-screen">
     <div className="animate-spin w-10 h-10 border-b-3 border-purple-700 rounded-full mb-2"/>
        <p className="text-sm text-gray-500 font-medium">Loading Update Reports</p>
  </div>;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans shadow-sm">
      <div className="flex-1 w-full mx-auto px-4 py-8 max-w-7xl">
        
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-bold shadow-sm hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-200 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Update Daily Work Report</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelCls}>Candidate Name <span className="text-red-500">*</span></label>
              <input className={inputCls} value={formData.candidateName} maxLength={50} onChange={(e) => updateField("candidateName", e.target.value)} />
            </div>

            {/* <div>
              <label className={labelCls}>Position</label>
              <input className={inputCls} value={formData.position} onChange={(e) => updateField("position", e.target.value)} />
            </div> */}

            <div>
              <label className={labelCls}>Category <span className="text-red-500">*</span></label>
              <select className={inputCls} value={formData.category} onChange={(e) => handleCategoryChange(e.target.value)}>
                <option value="">Select Category</option>
                {categories?.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Role (Sub-Category) <span className="text-red-500">*</span></label>
              <select className={inputCls} value={formData.subCategory} onChange={(e) => handleSubCategoryChange(e.target.value)} disabled={!formData.category}>
                <option value="">Select Role</option>
                {subCategories["update-row"]?.map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Designation <span className="text-red-500">*</span></label>
              <select className={inputCls} value={formData.designation} onChange={(e) => updateField("designation", e.target.value)} disabled={!formData.subCategory}>
                <option value="">Select Designation</option>
                {designations["update-row"]?.map((des) => <option key={des._id} value={des._id}>{des.name}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Education <span className="text-red-500">*</span></label>
              <input
                className={inputCls}
                value={formData.education}
                maxLength={50}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[a-zA-Z0-9\s.,()\-]+$/.test(val)) {
                    updateField("education", val);
                  }
                }}
              />
            </div>

            <div>
              <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
              <input
                className={inputCls}
                value={formData.phoneNumber}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9\b]+$/.test(val)) {
                    updateField("phoneNumber", val);
                  }
                }}
              />
            </div>

            <div>
              <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
              <input className={inputCls} value={formData.email} maxLength={100} onChange={(e) => updateField("email", e.target.value)} />
            </div>

            <div>
              <label className={labelCls}>Interaction Type <span className="text-red-500">*</span></label>
              <select className={inputCls} value={formData.interactionType} onChange={(e) => updateField("interactionType", e.target.value)}>
                <option value="">Select Type</option>
                {interactions?.map((type, i) => <option key={i} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Candidate Status <span className="text-red-500">*</span></label>
              <select className={inputCls} value={formData.candidateStatus} onChange={(e) => updateField("candidateStatus", e.target.value)}>
                <option value="">Select Status</option>
                {statuses?.map((status, i) => <option key={i} value={status}>{status}</option>)}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className={labelCls}>Skills</label>
              <div className="flex flex-col gap-2">
                <input 
                  className={inputCls} 
                  placeholder="Type skill and press Enter" 
                  value={formData.skillInput} 
                  onChange={(e) => updateField("skillInput", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = formData.skillInput.trim();
                      if (val && !formData.skills.includes(val)) {
                        updateField("skills", [...formData.skills, val]);
                        updateField("skillInput", "");
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.skills.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-100">
                      {s} <X size={14} className="cursor-pointer" onClick={() => updateField("skills", formData.skills.filter(x => x !== s))} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className={labelCls}>Additional Notes</label>
              <textarea className={`${inputCls} h-24 resize-none`} value={formData.additionalNotes} onChange={(e) => updateField("additionalNotes", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
          <button onClick={() => navigate("/activity")} className="px-10 py-2.5 rounded-xl border border-purple-600 text-purple-600 text-sm font-bold">
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={updating}
            className="px-10 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-bold disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Report"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}