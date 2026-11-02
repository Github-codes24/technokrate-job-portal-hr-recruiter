// import React, { useState } from "react";
// import { ArrowLeft, Eye } from "lucide-react";

// const candidate = {
//   name: "Aman Kumar",
//   role: "Android Developer",
//   company: "Ernst & Young",
//   location: "Nagpur, Maharashtra, India",
//   about:
//     "Android Developer with a passion for building scalable, high-performance mobile applications that deliver seamless and user-centric experiences....",
//   skills: ["Java", "Kotlin", "Angular"],
//   education: [
//     { school: "Anna University, Chennai, Tamil Nadu", degree: "Master of Technology in Artificial Intelligence" },
//     { school: "Anna University, Chennai, Tamil Nadu", degree: "Master of Technology in Artificial Intelligence" },
//   ],
//   experience: [
//     {
//       logo: "IN",
//       title: "Junior Android Developer · Full-time",
//       duration: "Jan 2023 – Jun 2024 · 1 yr 10 mos",
//       location: "Pune, Maharashtra, India · On-site",
//       color: "bg-blue-600",
//     },
//     {
//       logo: "P",
//       title: "Android Developer · Full-time",
//       duration: "Oct 2022 – Dec 2022 · 3 mos",
//       location: "Nagpur, Maharashtra, India · On-site",
//       color: "bg-red-500",
//     },
//   ],
//   certifications: [
//     { name: "Android Developer", issuer: "Google", issued: "Dec 2023" },
//     { name: "Java Full Stack", issuer: "Google", issued: "Dec 2023" },
//   ],
//   resumes: ["resume_ninad_Android.pdf", "resume_ninad_Android.pdf"],
// };

// export default function ViewDailyActivity({ onBack }) {
//   const [showMore, setShowMore] = useState(false);
//   const [showAllEdu, setShowAllEdu] = useState(false);

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <div className="flex-1  w-full mx-auto px-4 py-8">
//         {/* Back */}
//         <button onClick={onBack} className="text-gray-600 hover:text-purple-600 mb-6 flex items-center gap-1 transition">
//           <ArrowLeft size={18} />
//         </button>

//         <div className="bg-white rounded-2xl border border-gray-200 p-6">
//           <h2 className="text-lg font-bold text-gray-800 mb-6">Candidate Profile</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* LEFT */}
//             <div>
//               {/* Header */}
//               <div className="flex items-center gap-4 mb-5">
//                 <img
//                   src="https://randomuser.me/api/portraits/men/32.jpg"
//                   alt="avatar"
//                   className="w-16 h-16 rounded-full object-cover"
//                   onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Aman+Kumar&background=7c3aed&color=fff"; }}
//                 />
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
//                   <p className="text-sm text-gray-500">{candidate.role}</p>
//                   <p className="text-sm text-gray-500">{candidate.company}</p>
//                   <p className="text-xs text-gray-400">{candidate.location}</p>
//                 </div>
//               </div>

//               {/* About */}
//               <div className="mb-5">
//                 <p className="text-sm font-semibold text-gray-700 mb-1">About</p>
//                 <p className="text-sm text-gray-500 leading-relaxed">
//                   {showMore ? candidate.about.replace("....", "") : candidate.about}
//                 </p>
//                 <button onClick={() => setShowMore(!showMore)} className="text-sm text-gray-500 underline mt-1">
//                   {showMore ? "see less" : "see more"}
//                 </button>
//               </div>

//               {/* Top Skills */}
//               <div className="border border-gray-200 rounded-xl p-4 mb-5">
//                 <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                   <span>🏆</span> Top skills
//                 </p>
//                 <p className="text-sm text-gray-600">{candidate.skills.join(" , ")}.</p>
//               </div>

//               {/* Education */}
//               <div>
//                 <p className="text-sm font-semibold text-gray-700 mb-3">Education</p>
//                 <div className="flex flex-col gap-3">
//                   {(showAllEdu ? candidate.education : candidate.education.slice(0, 2)).map((e, i) => (
//                     <div key={i} className="flex items-start gap-3">
//                       <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold shrink-0">🎓</div>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-800">{e.school}</p>
//                         <p className="text-xs text-gray-500">{e.degree}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => setShowAllEdu(!showAllEdu)}
//                   className="text-sm text-gray-600 mt-3 flex items-center gap-1 hover:text-purple-600 transition"
//                 >
//                   {showAllEdu ? "Hide educations" : "Show all educations"} →
//                 </button>
//               </div>
//             </div>

//             {/* RIGHT */}
//             <div className="flex flex-col gap-5">
//               {/* Experience */}
//               <div>
//                 <p className="text-sm text-gray-400 mb-3">Bangalore, Karnataka, India · On-site</p>
//                 {candidate.experience.map((ex, i) => (
//                   <div key={i} className="flex items-start gap-3 mb-4">
//                     <div className={`w-9 h-9 rounded ${ex.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
//                       {ex.logo}
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-800">{ex.title}</p>
//                       <p className="text-xs text-gray-500">{ex.duration}</p>
//                       <p className="text-xs text-gray-400">{ex.location}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <hr className="border-gray-100" />

//               {/* Certifications */}
//               <div>
//                 <p className="text-sm font-semibold text-gray-700 mb-3">Certifications</p>
//                 {candidate.certifications.map((c, i) => (
//                   <div key={i} className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-blue-500">G</div>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-800">{c.name}</p>
//                         <p className="text-xs text-gray-500">{c.issuer}</p>
//                         <p className="text-xs text-gray-400">Issued &nbsp;{c.issued}</p>
//                       </div>
//                     </div>
//                     <Eye size={16} className="text-gray-400 hover:text-purple-600 cursor-pointer" />
//                   </div>
//                 ))}
//               </div>

//               <hr className="border-gray-100" />

//               {/* Resume */}
//               <div>
//                 <p className="text-sm font-semibold text-gray-700 mb-3">Resume</p>
//                 {candidate.resumes.map((r, i) => (
//                   <div key={i} className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className="w-9 h-9 bg-red-50 rounded flex items-center justify-center text-red-500 text-xs font-bold">PDF</div>
//                       <p className="text-sm text-gray-700">{r}</p>
//                     </div>
//                     <Eye size={16} className="text-gray-400 hover:text-purple-600 cursor-pointer" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <footer className="text-center text-xs text-gray-400 py-4">@ 2024 MyJob – Job Portal. All rights Rserved</footer>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Eye } from "lucide-react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchReportById, clearReportState } from "../../redux/slice/dailyActivity/getHrByIdSlice";

// export default function ViewDailyActivity() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { report, loading, error } = useSelector((state) => state.reportById);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchReportById(id));
//     }
//     return () => dispatch(clearReportState());
//   }, [id, dispatch]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <div className="animate-spin w-10 h-10 border-b-2 border-purple-700 rounded-full mb-2"/>
//         <p className="text-sm text-gray-500 font-medium">Loading reports Details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4">
//         <p className="text-red-500 mb-4">{error}</p>
//         <button onClick={() => navigate(-1)} className="text-purple-700 underline">Go Back</button>
//       </div>
//     );
//   }

//   const data = report || {};

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       <div className="flex-1 w-full mx-auto px-4 py-8">
//         {/* Back */}
//         <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-purple-600 mb-6 flex items-center gap-1 transition">
//           <ArrowLeft size={18} />
//         </button>

//         <div className="bg-white rounded-2xl border border-gray-200 p-6">
//           <h2 className="text-lg font-bold text-gray-800 mb-6">Candidate Profile</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <div className="flex items-center gap-4 mb-5">
//                 <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold border border-purple-200">
//                    {data.candidateName?.charAt(0) || "C"}
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900">{data.candidateName || "N/A"}</h3>
//                   <p className="text-sm text-gray-500">{data.position || "Not Specified"}</p>
//                   <p className="text-sm text-gray-500">Candidate Email: {data.email || "N/A"}</p>
//                   <p className="text-xs text-gray-400">Status: {data.candidateStatus || "Pending"}</p>
//                 </div>
//               </div>

//               <div className="mb-5">
//                 <p className="text-sm font-semibold text-gray-700 mb-1">Additional Notes</p>
//                 <p className="text-sm text-gray-500 leading-relaxed">
//                   {data.additionalNotes || "No additional notes provided by the recruiter."}
//                 </p>
//               </div>

//               <div className="border border-gray-200 rounded-xl p-4 mb-5">
//                 <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                    Contact Info
//                 </p>
//                 <p className="text-sm text-gray-600">Phone: {data.phoneNumber || "N/A"}</p>
//                 <p className="text-sm text-gray-600">Interaction: {data.interactionType || "N/A"}</p>
//               </div>

//               <div>
//                 <p className="text-sm font-semibold text-gray-700 mb-3">Education</p>
//                 <div className="flex flex-col gap-3">
//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold shrink-0">🎓</div>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-800">{data.education || "Information not provided"}</p>
//                         <p className="text-xs text-gray-500">Degree/Course Details</p>
//                       </div>
//                     </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col gap-5">
//               <div>
//                 <p className="text-sm text-gray-400 mb-3 font-semibold">
//                   Report Date: {data.reportDate ? new Date(data.reportDate).toLocaleDateString() : "N/A"}
//                 </p>
//                 <div className="flex items-start gap-3 mb-4">
//                   <div className={`w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0`}>
//                     HR
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-800">Recruiter ID: {data.hr || "N/A"}</p>
//                     <p className="text-xs text-gray-500">
//                       Created At: {data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <hr className="border-gray-100" />

//               <div>
//                 <p className="text-sm font-semibold text-gray-700 mb-3">Skills</p>
//                 <div className="flex flex-wrap gap-2">
//                   {data.skills && data.skills.length > 0 ? (
//                     data.skills.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-purple-50 text-purple-600 text-[11px] font-semibold rounded-md border border-purple-100 uppercase"
//                       >
//                         {skill}
//                       </span>
//                     ))
//                   ) : (
//                     <p className="text-xs text-gray-400 italic">No skills listed</p>
//                   )}
//                 </div>
//               </div>

//               <hr className="border-gray-100" />

//               <div>
//                 <p className="text-sm font-semibold text-gray-700 mb-3">Resume</p>
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 bg-red-50 rounded flex items-center justify-center text-red-500 text-xs font-bold">PDF</div>
//                     <p className="text-sm text-gray-700">candidate_resume.pdf</p>
//                   </div>
//                   <Eye size={16} className="text-gray-400 hover:text-purple-600 cursor-pointer" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <footer className="text-center text-xs text-gray-400 py-4">@ 2024 MyJob – Job Portal. All rights Reserved</footer>
//     </div>
//   );
// }






import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReportById,
  clearReportState,
} from "../../redux/slice/dailyActivity/getHrByIdSlice";
import Footer from "../../components/common/Footer";

export default function ViewDailyActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDownload = () => {
  const resumeUrl = data.candidate?.resume;
  if (resumeUrl) {
    // window.open(url, '_blank') se file new tab mein khulegi
    // Browser settings ke hisaab se PDF wahan view hogi ya seedha download ho jayegi
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  } else {
    alert("Resume not available");
  }
};

  // Selector according to your slice name "reportById"
  const { report, loading, error } = useSelector((state) => state.reportById);

  useEffect(() => {
    if (id) {
      dispatch(fetchReportById(id));
    }
    return () => dispatch(clearReportState());
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin w-10 h-10 border-b-3 border-purple-700 rounded-full mb-2" />
        <p className="text-sm text-gray-500 font-medium">
          Loading reports Details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-purple-700 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Handle data mapping from nested response
  const data = report || {};

  return (
    <div className="min-h-screen bg-white flex flex-col shadow-sm">
      <div className="flex-1 w-full mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-gray-300 bg-white text-gray-600 text-sm font-bold shadow-sm hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-200 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Candidate Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold border border-purple-200">
                  {data.candidateName?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {data.candidateName || "N/A"}
                  </h3>
                  {/* Showing Designation Name and SubCategory Name as Role */}
                  <p className="text-sm text-gray-500">
                    {data.designation?.name || "Not Specified"}
                    {data.subCategory?.name
                      ? ` | ${data.subCategory.name}`
                      : ""}
                  </p>
                  <p className="text-sm text-gray-500">
                    Candidate Email: {data.email || "N/A"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Status: {data.candidateStatus || "Pending"}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Additional Notes
                </p>
                <p
                  className="text-sm text-gray-500 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      data.additionalNotes ||
                      "No additional notes provided by the recruiter.",
                  }}
                />
              </div>

              <div className="border border-gray-200 rounded-xl p-4 mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  Contact Info
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {data.phoneNumber || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Interaction: {data.interactionType || "N/A"}
                </p>
                {/* Optional: Show Category */}
                <p className="text-xs text-purple-600 mt-1 font-medium italic">
                  Category: {data.category?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Education
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-500 text-xs font-bold shrink-0">
                      🎓
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {data.education || "Information not provided"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Academic Background
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* <div>
                <p className="text-sm text-gray-400 mb-3 font-semibold">
                  Report Date: {data.reportDate ? new Date(data.reportDate).toLocaleDateString() : "N/A"}
                </p>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    HR
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Recruiter ID: {data.hr || "N/A"}</p>
                    <p className="text-xs text-gray-500">
                      Created At: {data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div> */}

              <hr className="border-gray-100" />

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.skills && data.skills.length > 0 ? (
                    data.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-600 text-[11px] font-semibold rounded-md border border-purple-100 uppercase"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No skills listed
                    </p>
                  )}
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Resume
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-50 rounded flex items-center justify-center text-red-500 text-xs font-bold">
                      PDF
                    </div>
                    <p className="text-sm text-gray-700">
                      {data.candidateName || "candidate"}_resume.pdf
                    </p>
                  </div>
                  {/* <Download
                    size={16}
                    className="text-gray-400 hover:text-purple-600 cursor-pointer"
                  /> */}

                  <button 
      onClick={handleDownload}
      className="p-2 hover:bg-purple-50 rounded-full transition-colors group"
      title="View/Download Resume"
    >
      <Download
        size={20}
        className="text-gray-400 group-hover:text-purple-600"
      />
    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
