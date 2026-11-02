import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Filter,
  Eye,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobSeekerCategories } from "../../redux/slice/jobseeker/getAlljobSeekerCategory";
import {
  fetchSubCategories,
  fetchDesignations,
  clearRowData,
} from "../../redux/slice/dailyActivity/getDropdown";

const ViewAllCandidate = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.jobSeekerCategory);
  const { subCategories, designations } = useSelector((state) => state.dropdown);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchJobSeekerCategories());
    }
  }, [dispatch, categories]);

  useEffect(() => {
    if (id) {
      dispatch(fetchSubCategories({ categoryId: id, rowId: "jobSeekerFilter" }));
    }
    return () => {
      dispatch(clearRowData("jobSeekerFilter"));
    };
  }, [dispatch, id]);

  const subCategoriesList = (subCategories["jobSeekerFilter"] || []).map((sub) => ({
    value: sub._id,
    label: sub.name,
  }));

  const designationsList = (designations["jobSeekerFilter"] || []).map((des) => ({
    value: des._id,
    label: des.name,
  }));

  const currentCategory = categories?.find((cat) => cat._id === id);
  const categoryName = currentCategory ? currentCategory.name : "Job Seekers";

  const [candidatesList, setCandidatesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const names = ["Aman Kumar", "Ravi Kumar", "Sneha Patil", "Rahul Sharma", "Priya Singh"];
    const edus = ["B.Tech", "B.sc", "MCA", "BCA", "B.E."];
    const skillList = ["Java", "Kotlin", "Python", "React", "Node.js"];
    const locs = ["Nagpur", "Pune", "Mumbai", "Bangalore", "Hyderabad"];
    
    const list = Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      role: categoryName,
      name: names[i % names.length],
      edu: edus[i % edus.length],
      skills: skillList[i % skillList.length],
      exp: `${(i % 5) + 1} years`,
      loc: locs[i % locs.length],
    }));
    setCandidatesList(list);
    setCurrentPage(1);
  }, [categoryName]);

  const totalPages = Math.ceil(candidatesList.length / itemsPerPage);
  const displayedCandidates = candidatesList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const startItem = candidatesList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, candidatesList.length);

  return (
    <div className="min-h-screen bg-white p-4 font-sans shadow-sm">
      <div className="mx-auto bg-white rounded-lg   min-h-[800px] ">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full border border-black cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{categoryName}</h1>
        </div>
        <hr className="mb-6" />

        {/* Title and Filter Action */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{categoryName} Candidates</h2>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 font-bold cursor-pointer text-gray-800 hover:text-purple-700 transition-colors"
          >
            <Filter size={20} /> Filter
          </button>
        </div>

        {/* Candidates Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                <th className="p-4 border-b">Sr.No.</th>
                <th className="p-4 border-b">Candidate Role</th>
                <th className="p-4 border-b">Candidate Name</th>
                <th className="p-4 border-b">Education</th>
                <th className="p-4 border-b">Skills</th>
                <th className="p-4 border-b">Experience</th>
                <th className="p-4 border-b">Location</th>
                <th className="p-4 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {displayedCandidates.map((person, index) => (
                <tr
                  key={person.id}
                  className="hover:bg-gray-50 border-b last:border-0"
                >
                  <td className="p-4">{startItem + index}</td>
                  <td className="p-4">{person.role}</td>
                  <td className="p-4">{person.name}</td>
                  <td className="p-4">{person.edu}</td>
                  <td className="p-4">{person.skills}</td>
                  <td className="p-4">{person.exp}</td>
                  <td className="p-4">{person.loc}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => navigate("/job-seeker/candidate/view/1")}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => setCandidatesList(candidatesList.filter(c => c.id !== person.id))}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center mt-8">
          <p className="text-purple-700 font-bold">Showing {startItem} to {endItem} of {candidatesList.length}</p>
          <div className="flex items-center gap-2">
            <PaginationButton 
              icon={<ChevronLeft size={20} />} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            
            {/* Generate Page Numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <PaginationButton 
                key={i} 
                label={i + 1} 
                active={currentPage === i + 1} 
                onClick={() => setCurrentPage(i + 1)}
              />
            ))}

            <PaginationButton 
              icon={<ChevronRight size={20} />} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
            />
          </div>
        </div>
      </div>

      {/* Filter Modal/Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-sm h-full shadow-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Filter</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <Formik
              initialValues={{
                subcategory: "",
                designation: "",
                experience: "",
              }}
              onSubmit={(values) => {
                console.log(values);
                setIsFilterOpen(false);
              }}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  <FilterSelect
                    label="Sub-Categories"
                    name="subcategory"
                    placeholder="Select Sub-Categories"
                    options={subCategoriesList}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFieldValue("subcategory", val);
                      setFieldValue("designation", "");
                      if (val) {
                        dispatch(
                          fetchDesignations({
                            subCategoryId: val,
                            rowId: "jobSeekerFilter",
                          })
                        );
                      }
                    }}
                  />
                  <FilterSelect
                    label="Designation"
                    name="designation"
                    placeholder="Select Designation"
                    options={designationsList}
                    onChange={(e) => {
                      setFieldValue("designation", e.target.value);
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-sm text-gray-700">
                      Experience (Years)
                    </label>
                    <Field
                      type="number"
                      name="experience"
                      placeholder="Enter years of experience"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      min="0" // Negative numbers rokne ke liye
                    />
                  </div>
                  <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2">
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 border-2 border-purple-600 text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-purple-700 text-white font-bold py-3 rounded-xl hover:bg-purple-800"
                    >
                      Apply Filter
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const PaginationButton = ({ label, icon, active, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors
    ${active ? "bg-purple-700 text-white border-purple-700" : "text-purple-700 border-purple-300 hover:bg-purple-50"}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    {label || icon}
  </button>
);

const FilterSelect = ({ label, name, placeholder, options = [], onChange }) => (
  <div className="space-y-2">
    <label className="block text-lg font-medium text-gray-800">{label}</label>
    <div className="relative">
      <Field
        as="select"
        name={name}
        {...(onChange ? { onChange } : {})}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg appearance-none text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Field>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
        <ChevronDown size={20} />
      </div>
    </div>
  </div>
);

export default ViewAllCandidate;