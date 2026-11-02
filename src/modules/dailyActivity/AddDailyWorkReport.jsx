// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Calendar, Trash2, Plus, X } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchCategories,
//   fetchInteractionTypes,
//   fetchStatuses,
//   fetchSubCategories,
//   fetchDesignations,
//   clearRowData
// } from "../../redux/slice/dailyActivity/getDropdown";
// import { createDailyReport, resetReportStatus } from "../../redux/slice/dailyActivity/addReportSlice";
// import Footer from "../../components/common/Footer";
// import { toast } from "react-toastify";

// const emptyInteraction = () => ({
//   id: Date.now(),
//   candidateName: "",
//   category: "",
//   subCategory: "",
//   designation: "",
//   education: "",
//   phoneNumber: "",
//   email: "",
//   interactionType: "",
//   candidateStatus: "",
//   additionalNotes: "",
//   skills: [],
//   skillInput: "",
// });

// export default function AddDailyWorkReport({ onBack, onCancel }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { categories, interactions, statuses, subCategories, designations } = useSelector((state) => state.dropdown);
//   const { loading: submitting, success } = useSelector((state) => state.addReport);

//   // Current date ko YYYY-MM-DD format mein nikaalne ke liye logic
//   const today = new Date().toISOString().split('T')[0];
//   const [reportDate, setReportDate] = useState(today); // Default current date
//   const [interactionsList, setInteractionsList] = useState([emptyInteraction()]);

//   useEffect(() => {
//     dispatch(fetchCategories());
//     dispatch(fetchInteractionTypes());
//     dispatch(fetchStatuses());
//   }, [dispatch]);

//   useEffect(() => {
//     if (success) {
//       dispatch(resetReportStatus());
//       setInteractionsList([emptyInteraction()]);
//       setTimeout(() => {
//         navigate("/activity");
//       }, 100);
//     }
//   }, [success, dispatch, navigate]);

//   const update = (id, field, value) => {
//     setInteractionsList((prev) =>
//       prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
//     );
//   };

//   const handleCategoryChange = (id, catId) => {
//     update(id, "category", catId);
//     update(id, "subCategory", "");
//     update(id, "designation", "");
//     if (catId) {
//       dispatch(fetchSubCategories({ categoryId: catId, rowId: id }));
//     }
//   };

//   const handleSubCategoryChange = (id, subCatId) => {
//     update(id, "subCategory", subCatId);
//     update(id, "designation", "");
//     if (subCatId) {
//       dispatch(fetchDesignations({ subCategoryId: subCatId, rowId: id }));
//     }
//   };

//   const removeRow = (id) => {
//     if (interactionsList.length > 1) {
//       setInteractionsList((prev) => prev.filter((i) => i.id !== id));
//       dispatch(clearRowData(id));
//     }
//   };

//   const handleSubmit = () => {
//     const item = interactionsList[0];

//     if (!item.candidateName.trim()) {
//       toast.error("Name is required to fill");
//       return;
//     }

//     if (item.phoneNumber && item.phoneNumber.length !== 10) {
//       toast.error("Please enter a valid 10-digit phone number");
//       return;
//     }

//     const payload = {
//       ...item,
//       reportDate: reportDate, // Selected ya Current date yahan se jayegi
//       phoneNumber: item.phoneNumber ? `+91${item.phoneNumber}` : "",
//     };

//     dispatch(createDailyReport(payload));
//   };

//   const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300 bg-white placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed";
//   const labelCls = "block text-sm font-medium text-gray-700 mb-1";

//   return (
//     <div className="min-h-screen bg-white flex flex-col font-sans shadow-sm">
//       <div className="flex-1 w-full mx-auto px-4 py-8 max-w-full">

//         <div className="flex items-center gap-3 mb-6">
//           <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-purple-600 transition">
//             <ArrowLeft size={20} />
//           </button>
//           <h1 className="text-xl font-bold text-gray-900">Daily Work Report</h1>
//         </div>

//         {/* Date Input Section - Changed to type="date" */}
//         <div className="mb-8 max-w-xs">
//           <label className={labelCls}>Report Date</label>
//           <div className="relative">
//             <input
//               type="date"
//               value={reportDate}
//               max={today} // Future dates block karne ke liye (Optional)
//               onChange={(e) => setReportDate(e.target.value)}
//               className={`${inputCls} pr-10 cursor-pointer`}
//             />
//             {/* <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /> */}
//           </div>
//         </div>

//         {interactionsList.map((item, idx) => (
//           <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-5">
//               <h3 className="text-md font-bold text-purple-800">
//                 Candidate Interaction {interactionsList.length > 1 ? `#${idx + 1}` : ""}
//               </h3>

//               {interactionsList.length > 1 && (
//                 <button onClick={() => removeRow(item.id)} className="text-red-400 hover:text-red-600 p-1">
//                   <Trash2 size={20} />
//                 </button>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <label className={labelCls}>Candidate Name</label>
//                 <input className={inputCls} placeholder="Full Name" value={item.candidateName} onChange={(e) => update(item.id, "candidateName", e.target.value)} />
//               </div>

//               <div>
//                 <label className={labelCls}>Category</label>
//                 <select className={inputCls} value={item.category} onChange={(e) => handleCategoryChange(item.id, e.target.value)}>
//                   <option value="">Select Category</option>
//                   {categories?.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelCls}>Role (Sub-Category)</label>
//                 <select className={inputCls} value={item.subCategory} onChange={(e) => handleSubCategoryChange(item.id, e.target.value)} disabled={!item.category}>
//                   <option value="">Select Role</option>
//                   {subCategories[item.id]?.map((sub) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelCls}>Designation</label>
//                 <select className={inputCls} value={item.designation} onChange={(e) => update(item.id, "designation", e.target.value)} disabled={!item.subCategory}>
//                   <option value="">Select Designation</option>
//                   {designations[item.id]?.map((des) => <option key={des._id} value={des._id}>{des.name}</option>)}
//                 </select>
//               </div>

// <div>
//   <label className={labelCls}>Education</label>
//   <input className={inputCls} placeholder="eg. BCA, B.Tech" value={item.education} onChange={(e) => update(item.id, "education", e.target.value)} />
// </div>

// <div>
//   <label className={labelCls}>Phone Number</label>
//   <input
//     type="text"
//     className={inputCls}
//     placeholder="00000 00000"
//     value={item.phoneNumber}
//     maxLength={10}
//     onChange={(e) => {
//       const val = e.target.value;
//       if (val === '' || /^[0-9\b]+$/.test(val)) {
//         update(item.id, "phoneNumber", val);
//       }
//     }}
//   />
// </div>

// <div>
//   <label className={labelCls}>Email Address</label>
//   <input className={inputCls} placeholder="example@mail.com" value={item.email} onChange={(e) => update(item.id, "email", e.target.value)} />
// </div>

//               <div>
//                 <label className={labelCls}>Interaction Type</label>
//                 <select className={inputCls} value={item.interactionType} onChange={(e) => update(item.id, "interactionType", e.target.value)}>
//                   <option value="">Select Type</option>
//                   {interactions?.map((type, i) => <option key={i} value={type}>{type}</option>)}
//                 </select>
//               </div>

//               <div>
//                 <label className={labelCls}>Candidate Status</label>
//                 <select className={inputCls} value={item.candidateStatus} onChange={(e) => update(item.id, "candidateStatus", e.target.value)}>
//                   <option value="">Select Status</option>
//                   {statuses?.map((status, i) => <option key={i} value={status}>{status}</option>)}
//                 </select>
//               </div>

// <div className="lg:col-span-3">
//   <label className={labelCls}>Skills <span className="text-red-500 font-normal">[optional]</span></label>
//   <div className="flex flex-col gap-2">
//     <input
//       className={inputCls}
//       placeholder="Type skill and press Enter"
//       value={item.skillInput}
//       onChange={(e) => update(item.id, "skillInput", e.target.value)}
//       onKeyDown={(e) => {
//         if (e.key === "Enter") {
//           e.preventDefault();
//           const val = item.skillInput.trim();
//           if (val && !item.skills.includes(val)) {
//             update(item.id, "skills", [...item.skills, val]);
//             update(item.id, "skillInput", "");
//           }
//         }
//       }}
//     />
//     <div className="flex flex-wrap gap-2 mt-1">
//       {item.skills.map((s) => (
//         <span key={s} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-100">
//           {s} <X size={14} className="cursor-pointer hover:text-purple-900" onClick={() => update(item.id, "skills", item.skills.filter(x => x !== s))} />
//         </span>
//       ))}
//     </div>
//   </div>
// </div>

//               <div className="lg:col-span-3">
//                 <label className={labelCls}>Additional Notes</label>
//                 <textarea
//                   className={`${inputCls} h-24 resize-none`}
//                   placeholder="Summarize the interaction..."
//                   value={item.additionalNotes}
//                   onChange={(e) => update(item.id, "additionalNotes", e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
//           <button
//             onClick={() => navigate("/activity")}
//             className="px-10 py-2.5 rounded-xl border border-purple-600 text-purple-600 text-sm font-bold hover:bg-purple-50 transition"
//             disabled={submitting}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={submitting}
//             className={`px-10 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-bold transition shadow-lg shadow-purple-100 ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-800'}`}
//           >
//             {submitting ? "Saving Report..." : "Submit Daily Report"}
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { ArrowLeft, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  fetchInteractionTypes,
  fetchStatuses,
  fetchSubCategories,
  fetchDesignations,
  clearRowData,
} from "../../redux/slice/dailyActivity/getDropdown";
import {
  createDailyReport,
  resetReportStatus,
} from "../../redux/slice/dailyActivity/addReportSlice";
import { toast } from "react-toastify";
import { addNotification } from "../../components/common/notificationHelper";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
const TipTapEditor = ({
  value,
  onChange,
  placeholder = "Summarize the interaction...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[100px] p-3",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="border-b border-gray-200 p-2 flex gap-1 flex-wrap bg-gray-50">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition ${editor?.isActive("bold") ? "bg-gray-200" : ""}`}
          type="button"
        >
          <b>B</b>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition ${editor?.isActive("italic") ? "bg-gray-200" : ""}`}
          type="button"
        >
          <i>I</i>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded hover:bg-gray-200 transition ${editor?.isActive("underline") ? "bg-gray-200" : ""}`}
          type="button"
        >
          <u>U</u>
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const emptyInteraction = () => ({
  id: Date.now(),
  candidateName: "",
  category: "",
  subCategory: "",
  designation: "",
  education: "",
  phoneNumber: "",
  email: "",
  interactionType: "",
  candidateStatus: "",
  additionalNotes: "",
  // skills: [],
  skillInput: "",
  state: "",
  city: "",
  countryId: 101, // Default to India (ID: 101) or 0
  stateId: 0,
  cityId: 0,
  resume: null,
});

export default function AddDailyWorkReport({ onBack, onCancel }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories, interactions, statuses, subCategories, designations } =
    useSelector((state) => state.dropdown);
  const { loading: submitting, success } = useSelector(
    (state) => state.addReport,
  );

  const today = new Date().toISOString().split("T")[0];
  const [reportDate, setReportDate] = useState(today);
  const [interactionsList, setInteractionsList] = useState([
    emptyInteraction(),
  ]);
  const [submittedReportInfo, setSubmittedReportInfo] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchInteractionTypes());
    dispatch(fetchStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      if (submittedReportInfo) {
        addNotification(
          "Daily Work Report Added",
          `Report for candidate ${submittedReportInfo.candidateName} added.`,
          `A new daily work report for Candidate "${submittedReportInfo.candidateName}" has been successfully added. Category: "${submittedReportInfo.categoryName}", Sub-Category: "${submittedReportInfo.subCategoryName}", Designation: "${submittedReportInfo.designationName}".`,
          "bg-green-50"
        );
        setSubmittedReportInfo(null);
      }
      dispatch(resetReportStatus());
      setInteractionsList([emptyInteraction()]);
      setTimeout(() => {
        navigate("/activity");
      }, 100);
    }
  }, [success, dispatch, navigate, submittedReportInfo]);

  const update = (id, field, value) => {
    setInteractionsList((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );
  };

  const handleCategoryChange = (id, catId) => {
    update(id, "category", catId);
    update(id, "subCategory", "");
    update(id, "designation", "");
    if (catId) {
      dispatch(fetchSubCategories({ categoryId: catId, rowId: id }));
    }
  };

  const handleSubCategoryChange = (id, subCatId) => {
    update(id, "subCategory", subCatId);
    update(id, "designation", "");
    if (subCatId) {
      dispatch(fetchDesignations({ subCategoryId: subCatId, rowId: id }));
    }
  };

  const removeRow = (id) => {
    if (interactionsList.length > 1) {
      setInteractionsList((prev) => prev.filter((i) => i.id !== id));
      dispatch(clearRowData(id));
    }
  };

  const handleSubmit = () => {
    const item = interactionsList[0];
    if (!item.candidateName.trim()) {
      toast.error("Candidate Name is required");
      return;
    }
    if (item.candidateName.length > 50) {
      toast.error("Candidate Name must be at most 50 characters long");
      return;
    }
    if (!/^[a-zA-Z\s.]+$/.test(item.candidateName)) {
      toast.error("Candidate Name can only contain alphabetic characters, spaces, and dots");
      return;
    }

    if (!item.email.trim()) {
      toast.error("Email Address is required");
      return;
    }
    if (item.email.length > 100) {
      toast.error("Email Address must be at most 100 characters long");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(item.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!item.category) {
      toast.error("Category is required");
      return;
    }

    if (!item.subCategory) {
      toast.error("Role (Sub-Category) is required");
      return;
    }

    if (!item.designation) {
      toast.error("Designation is required");
      return;
    }

    if (!item.education.trim()) {
      toast.error("Education is required");
      return;
    }
    if (item.education.length > 50) {
      toast.error("Education must be at most 50 characters long");
      return;
    }
    const eduRegex = /^[a-zA-Z0-9\s.,()\-]+$/;
    if (!eduRegex.test(item.education)) {
      toast.error("Education can only contain letters, numbers, spaces, dots, commas, hyphens, and parentheses");
      return;
    }

    if (!item.phoneNumber.trim()) {
      toast.error("Phone Number is required");
      return;
    }
    if (!/^\d{10}$/.test(item.phoneNumber)) {
      toast.error("Phone Number must contain exactly 10 digits");
      return;
    }
    if (item.phoneNumber.startsWith("00")) {
      toast.error("Phone Number cannot start with '00'");
      return;
    }

    if (!item.candidateStatus) {
      toast.error("Candidate Status is required");
      return;
    }

    if (!item.state) {
      toast.error("State is required");
      return;
    }

    if (!item.city) {
      toast.error("City is required");
      return;
    }

    const formData = new FormData();
    formData.append("reportDate", reportDate);
    formData.append("candidateName", item.candidateName);

    const formattedPhone = item.phoneNumber
      ? item.phoneNumber.startsWith("+91")
        ? item.phoneNumber
        : `+91${item.phoneNumber}`
      : "";
    formData.append("phoneNumber", formattedPhone);

    // Baki fields...
    formData.append("category", item.category);
    formData.append("subCategory", item.subCategory);
    formData.append("designation", item.designation);
    formData.append("education", item.education);
    formData.append("email", item.email);
    formData.append("interactionType", item.interactionType || "Call");
    formData.append("candidateStatus", item.candidateStatus);
    formData.append("additionalNotes", item.additionalNotes || "");
    formData.append("location[state]", item.state || "");
    formData.append("location[city]", item.city || "");

    if (item.resume) {
      formData.append("resume", item.resume);
    }

    setSubmittedReportInfo({
      candidateName: item.candidateName,
      categoryName: categories.find(c => c._id === item.category)?.name || "N/A",
      subCategoryName: subCategories[item.id]?.find(s => s._id === item.subCategory)?.name || "N/A",
      designationName: designations[item.id]?.find(d => d._id === item.designation)?.name || "N/A",
    });

    dispatch(createDailyReport(formData));
  };
  const inputCls =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-purple-300 bg-white placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1 py-1";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans shadow-sm">
      {/* CSS overrides for country-state-city-react-select dropdowns */}
      <style>{`
        /* ── container: match border + rounding of inputCls ── */
        .stdropdown-container {
          border: 1px solid #e5e7eb !important;
          border-radius: 0.5rem !important;
          background: #fff !important;
          width: 100% !important;
          box-shadow: none !important;
        }
        .stdropdown-container:focus-within {
          outline: none !important;
          box-shadow: 0 0 0 2px #c4b5fd !important;  /* focus:ring-purple-300 */
          border-color: #c4b5fd !important;
        }

        /* ── selected / input row: match px-4 py-2.5 text-sm ── */
        .stdropdown-input {
          padding: 0 1rem !important;
          height: 2.5rem !important;        /* py-2.5 × 2 + line-height ≈ 40 px */
          font-size: 0.875rem !important;   /* text-sm */
          color: #374151 !important;        /* text-gray-700 */
          background: transparent !important;
          border: none !important;
          outline: none !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
        }

        /* ── search input inside the open menu ── */
        .stdropdown-input input {
          font-size: 0.875rem !important;
          color: #374151 !important;
          background: transparent !important;
          border: none !important;
          outline: none !important;
          width: 100% !important;
        }

        /* ── dropdown menu: constrained height + scroll ── */
        .stdropdown-menu {
          max-height: 200px !important;
          overflow-y: auto !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.5rem !important;
          margin-top: 4px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          z-index: 9999 !important;
          background: #fff !important;
          position: absolute !important;
          width: 100% !important;
          left: 0 !important;
        }

        /* ── individual option rows ── */
        .stdropdown-item {
          font-size: 0.875rem !important;
          padding: 0.5rem 1rem !important;
          color: #374151 !important;
          cursor: pointer !important;
        }
        .stdropdown-item:hover,
        .stdropdown-item.selected {
          background-color: #f3e8ff !important;  /* purple-50 */
          color: #7e22ce !important;              /* purple-700 */
        }

        /* ── clear/caret icons alignment ── */
        .stdropdown-icon {
          display: flex !important;
          align-items: center !important;
          padding-right: 0.75rem !important;
        }
      `}</style>

      <div className="flex-1 w-full mx-auto px-4 py-8 max-w-full">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-bold shadow-sm hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-200 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Daily Work Report</h1>
        </div>

        <div className="mb-6 max-w-xs">
          <label className={labelCls}>Report Date</label>
          <input
            type="date"
            value={reportDate}
            max={today}
            onChange={(e) => setReportDate(e.target.value)}
            className={`${inputCls} cursor-pointer`}
          />
        </div>

        {interactionsList.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-md font-bold text-purple-800">
                Candidate Interaction{" "}
                {interactionsList.length > 1 ? `#${idx + 1}` : ""}
              </h3>
              {interactionsList.length > 1 && (
                <button
                  onClick={() => removeRow(item.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Candidate Info Fields */}
              <div>
                <label className={labelCls}>Candidate Name <span className="text-red-500">*</span></label>
                <input
                  className={inputCls}
                  placeholder="Full Name"
                  value={item.candidateName}
                  maxLength={50}
                  onChange={(e) =>
                    update(item.id, "candidateName", e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                <input
                  className={inputCls}
                  placeholder="example@mail.com"
                  value={item.email}
                  maxLength={100}
                  onChange={(e) => update(item.id, "email", e.target.value)}
                />
              </div>

              <div>
                <label className={labelCls}>Category <span className="text-red-500">*</span></label>
                <select
                  className={inputCls}
                  value={item.category}
                  onChange={(e) =>
                    handleCategoryChange(item.id, e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Role (Sub-Category) <span className="text-red-500">*</span></label>
                <select
                  className={inputCls}
                  value={item.subCategory}
                  onChange={(e) =>
                    handleSubCategoryChange(item.id, e.target.value)
                  }
                  disabled={!item.category}
                >
                  <option value="">Select Role</option>
                  {subCategories[item.id]?.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Designation <span className="text-red-500">*</span></label>
                <select
                  className={inputCls}
                  value={item.designation}
                  onChange={(e) =>
                    update(item.id, "designation", e.target.value)
                  }
                  disabled={!item.subCategory}
                >
                  <option value="">Select Designation</option>
                  {designations[item.id]?.map((des) => (
                    <option key={des._id} value={des._id}>
                      {des.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Education <span className="text-red-500">*</span></label>
                <input
                  className={inputCls}
                  placeholder="eg. BCA, B.Tech"
                  value={item.education}
                  maxLength={50}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^[a-zA-Z0-9\s.,()\-]+$/.test(val)) {
                      update(item.id, "education", val);
                    }
                  }}
                />
              </div>

              <div>
                <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="00000 00000"
                  value={item.phoneNumber}
                  maxLength={10}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^[0-9\b]+$/.test(val))
                      update(item.id, "phoneNumber", val);
                  }}
                />
              </div>

              <div>
                <label className={labelCls}>Candidate Status <span className="text-red-500">*</span></label>
                <select
                  className={inputCls}
                  value={item.candidateStatus}
                  onChange={(e) =>
                    update(item.id, "candidateStatus", e.target.value)
                  }
                >
                  <option value="">Select Status</option>
                  {statuses?.map((status, i) => (
                    <option key={i} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Resume (PDF)</label>
                <input
                  type="file"
                  className={inputCls}
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => update(item.id, "resume", e.target.files[0])}
                />
              </div>

              {/* Location Section - Only State and City with scroll limit */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div style={{ display: "none" }}>
                  <CountrySelect
                    defaultValue={{ id: 101, name: "India" }}
                    onChange={(e) => update(item.id, "countryId", e.id)}
                  />
                </div>
                <div>
                  <label className={labelCls}>State <span className="text-red-500">*</span></label>
                  <StateSelect
                    countryid={item.countryId || 101}
                    onChange={(e) => {
                      update(item.id, "stateId", e.id);
                      update(item.id, "state", e.name);
                    }}
                    placeHolder="Select State"
                  />
                </div>

                <div>
                  <label className={labelCls}>City <span className="text-red-500">*</span></label>
                  <CitySelect
                    countryid={item.countryId || 101}
                    stateid={item.stateId}
                    onChange={(e) => {
                      update(item.id, "cityId", e.id);
                      update(item.id, "city", e.name);
                    }}
                    placeHolder="Select City"
                  />
                </div>
              </div>

              {/* Additional Notes - Bold, Italic, Underline only */}
              <div className="lg:col-span-3">
                <label className={labelCls}>Additional Notes</label>
                <TipTapEditor
                  value={item.additionalNotes}
                  onChange={(html) => update(item.id, "additionalNotes", html)}
                />
              </div>
            </div>
            {/* <div className="lg:col-span-3 mt-3">
                <label className={labelCls}>Skills <span className="text-red-500 font-normal">[optional]</span></label>
                <div className="flex flex-col gap-2">
                  <input
                    className={inputCls}
                    placeholder="Type skill and press Enter"
                    value={item.skillInput}
                    onChange={(e) => update(item.id, "skillInput", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = item.skillInput.trim();
                        if (val && !item.skills.includes(val)) {
                          update(item.id, "skills", [...item.skills, val]);
                          update(item.id, "skillInput", "");
                        }
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.skills.map((s) => (
                      <span key={s} className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-100">
                        {s} <X size={14} className="cursor-pointer hover:text-purple-900" onClick={() => update(item.id, "skills", item.skills.filter(x => x !== s))} />
                      </span>
                    ))}
                  </div>
                </div>
              </div> */}
          </div>
        ))}

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate("/activity")}
            className="px-10 py-2.5 rounded-xl border border-purple-600 text-purple-600 text-sm font-bold"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-10 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-bold shadow-lg ${submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-800"}`}
          >
            {submitting ? "Saving Report..." : "Submit Daily Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
