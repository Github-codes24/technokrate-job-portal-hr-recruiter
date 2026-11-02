import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Search, Upload, X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  fetchCategories,
  fetchSubCategories,
  fetchDesignations,
} from "../../redux/slice/dailyActivity/getDropdown";
import {
  uploadCandidateDatabase,
  resetStatus,
} from "../../redux/slice/candidateDatabase/createDatabaseSlice";
import CandidateTable from "./CandidateTable";
import { fetchAllCandidates } from "../../redux/slice/candidateDatabase/getAllCandidate";
import Footer from "../../components/common/Footer";
import { addNotification } from "../../components/common/notificationHelper";
import CandidateAssignPageView from "../../components/common/CandidateAssignPageView";

const UploadSchema = Yup.object().shape({
  category: Yup.string().required("Required"),
  subCategory: Yup.string().required("Required"),
  designation: Yup.string().required("Required"),
  file: Yup.mixed()
    .required("An Excel file is required")
    .test("fileFormat", "Only .xlsx or .xls files are allowed", (value) => {
      if (value) {
        const supportedFormats = ["xlsx", "xls"];
        const fileExtension = value.name.split(".").pop().toLowerCase();
        return supportedFormats.includes(fileExtension);
      }
      return true;
    }),
});

const CandidateDatabase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [lastUploadValues, setLastUploadValues] = useState(null);
  const dispatch = useDispatch();

  // Redux States
  const { categories, subCategories, designations } = useSelector(
    (state) => state.dropdown
  );
  const { loading: uploading, success } = useSelector(
    (state) => state.database
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      if (lastUploadValues) {
        const selectedCategory = categories.find(c => c._id === lastUploadValues.category)?.name || "N/A";
        const selectedSubCategory = subCategories["uploadModal"]?.find(s => s._id === lastUploadValues.subCategory)?.name || "N/A";
        const selectedDesignation = designations["uploadModal"]?.find(d => d._id === lastUploadValues.designation)?.name || "N/A";

        addNotification(
          "Candidate Database Uploaded",
          "Database uploaded successfully.",
          `A new candidate database file has been uploaded under Category: "${selectedCategory}", Sub-Category: "${selectedSubCategory}", Designation: "${selectedDesignation}".`,
          "bg-green-50"
        );
        setLastUploadValues(null);
      }
      dispatch(fetchAllCandidates({ page: 1, limit: 5 }));
      dispatch(resetStatus());
    }
  }, [success, dispatch, lastUploadValues, categories, subCategories, designations]);

  const handleSubmit = (values) => {
    if (!values.file) return;

    setLastUploadValues(values);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet data to JSON array
        const jsonRows = XLSX.utils.sheet_to_json(worksheet);

        const payload = {
          category: values.category,
          subCategory: values.subCategory,
          designation: values.designation,
          excelData: jsonRows,
        };

        dispatch(uploadCandidateDatabase(payload));
      } catch (err) {
        alert("Failed to parse Excel file. Please check if the file format is valid.");
      }
    };
    reader.readAsArrayBuffer(values.file);
  };

  // On View click, render Page View directly without needing double click
  if (selectedCandidate) {
    return (
      <div className="min-h-screen bg-white p-4 font-sans">
        <CandidateAssignPageView
          candidate={selectedCandidate}
          onBack={() => setSelectedCandidate(null)}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 font-sans shadow-sm">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Candidate Database
        </h1>
        <hr className="mb-8 border-gray-300" />

        <div className=" rounded-xl shadow-sm border border-gray-100 p-5 min-h-[600px]">
          {/* Search and Upload Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-1/3">
              <span className="absolute inset-y-0 left-3 flex items-center text-purple-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search candidates by category, sub-category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              Upload Database
            </button>
          </div>

          <CandidateTable
            searchQuery={searchQuery}
            onViewCandidate={(c) => setSelectedCandidate(c)}
          />
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Upload Candidate Database
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>

            <Formik
              initialValues={{
                category: "",
                subCategory: "",
                designation: "",
                file: null,
              }}
              validationSchema={UploadSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("category", val);
                        setFieldValue("subCategory", "");
                        setFieldValue("designation", "");
                        if (val)
                          dispatch(
                            fetchSubCategories({
                              categoryId: val,
                              rowId: "uploadModal",
                            })
                          );
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Category
                    </label>
                    <Field
                      as="select"
                      name="subCategory"
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("subCategory", val);
                        setFieldValue("designation", "");
                        if (val)
                          dispatch(
                            fetchDesignations({
                              subCategoryId: val,
                              rowId: "uploadModal",
                            })
                          );
                      }}
                    >
                      <option value="">Select Sub Category</option>
                      {subCategories["uploadModal"]?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="subCategory"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <Field
                      as="select"
                      name="designation"
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select Designation</option>
                      {designations["uploadModal"]?.map((des) => (
                        <option key={des._id} value={des._id}>
                          {des.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="designation"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload File (Excel)
                    </label>
                    <div className="flex flex-col gap-2">
                      <label className="bg-purple-700 hover:bg-purple-800 text-white w-max px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 text-sm transition-colors">
                        <Upload size={16} />{" "}
                        {values.file ? values.file.name : "Choose File"}
                        <input
                          type="file"
                          className="hidden"
                          accept=".xlsx, .xls"
                          onChange={(e) =>
                            setFieldValue("file", e.target.files[0])
                          }
                        />
                      </label>
                      <ErrorMessage
                        name="file"
                        component="div"
                        className="text-red-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="border-2 border-purple-600 text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-purple-700 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition-colors flex justify-center items-center gap-2"
                    >
                      {uploading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        "Upload Database"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default CandidateDatabase;
