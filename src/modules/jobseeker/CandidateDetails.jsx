import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Calendar,
  User
} from 'lucide-react';

const CandidateDetails = () => {
  const navigate = useNavigate();

  // This would typically come from a state management tool or an API call using a ID from params
  const candidateData = {
    name: "Aman Kumar",
    role: "Android Developer",
    category: "IT & Technology",
    subCategory: "Software Development",
    experience: "2 years",
    education: "B.Tech in Computer Science",
    skills: ["Java", "Kotlin", "Firebase", "REST APIs"],
    location: "Nagpur, Maharashtra",
    email: "aman.kumar@example.com", // Added standard fields for completeness
    phone: "+91 98765 43210",
    gender: "Male",
    age: "24"
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Name",
      "Role",
      "Category",
      "Sub-Category",
      "Experience",
      "Education",
      "Skills",
      "Location",
      "Email",
      "Phone",
      "Gender",
      "Age",
    ];
    const data = [
      candidateData.name,
      candidateData.role,
      candidateData.category,
      candidateData.subCategory,
      candidateData.experience,
      candidateData.education,
      candidateData.skills.join(", "),
      candidateData.location,
      candidateData.email,
      candidateData.phone,
      candidateData.gender,
      candidateData.age,
    ];

    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(","),
      data.map((d) => `"${String(d).replace(/"/g, '""')}"`).join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${candidateData.name.replace(/\s+/g, "_")}_details.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContactCandidate = () => {
    window.location.href = `mailto:${candidateData.email}?subject=Job Inquiry - ${candidateData.role}&body=Hi ${candidateData.name},%0D%0A%0D%0AWe are interested in your profile for the ${candidateData.role} position.`;
  };

  return (
    <div className="min-h-screen bg-white p-4 font-sans shadow-sm">
      <div className=" mx-auto">
        {/* Top Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-700 transition-colors mb-6 group"
        >
          <div className="p-2 border border-gray-300 rounded-full group-hover:border-purple-700">
            <ArrowLeft size={18} />
          </div>
          <span className="font-semibold">Back to Database</span>
        </button>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header/Banner Section */}
          <div className="bg-purple-700 h-32 px-8 pt-8 relative">
             <div className="absolute -bottom-12 left-8 bg-white p-1 rounded-2xl shadow-md">
                <div className="bg-purple-100 w-24 h-24 rounded-xl flex items-center justify-center text-purple-700">
                  <User size={48} />
                </div>
             </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{candidateData.name}</h1>
                <p className="text-purple-600 font-semibold text-lg">{candidateData.role}</p>
              </div>
              <span className="bg-purple-50 text-purple-700 px-4 py-1 rounded-full text-sm font-bold border border-purple-100">
                {candidateData.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <ContactInfo icon={<Mail size={18}/>} label="Email" value={candidateData.email} />
              <ContactInfo icon={<Phone size={18}/>} label="Phone" value={candidateData.phone} />
              <ContactInfo icon={<MapPin size={18}/>} label="Location" value={candidateData.location} />
            </div>

            <hr className="my-8 border-gray-100" />

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-10">
              {/* Professional Stats */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Briefcase className="text-purple-600" size={20} /> Professional Details
                </h2>
                
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <DetailItem label="Sub-Category" value={candidateData.subCategory} />
                  <DetailItem label="Experience Range" value={candidateData.experience} />
                  <DetailItem label="Age" value={candidateData.age} />
                  <DetailItem label="Gender" value={candidateData.gender} />
                </div>
              </section>

              {/* Education & Skills */}
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="text-purple-600" size={20} /> Education & Skills
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Highest Education</p>
                    <p className="text-gray-800 font-medium">{candidateData.education}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {candidateData.skills.map((skill, i) => (
                        <span key={i} className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="bg-gray-50 p-6 flex justify-end gap-4 border-t border-gray-100">
            <button 
              onClick={handleDownloadCSV}
              className="px-6 py-2 border-2 border-purple-600 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors"
            >
              Download CSV Data
            </button>
            <button 
              onClick={handleContactCandidate}
              className="px-6 py-2 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 transition-colors"
            >
              Contact Candidate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const ContactInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
    <div className="text-purple-400 shrink-0 flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 uppercase tracking-wider leading-none mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-800 font-semibold text-sm">{value}</span>
  </div>
);

export default CandidateDetails;