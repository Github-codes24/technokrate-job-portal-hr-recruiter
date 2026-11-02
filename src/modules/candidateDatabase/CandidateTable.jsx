import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FileSpreadsheet, Download, Loader2, AlertCircle, 
  ChevronLeft, ChevronRight, Search,
  Eye, Edit, Trash2, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAllCandidates, removeCandidateLocally, updateCandidateLocally, deleteCandidateDatabase } from '../../redux/slice/candidateDatabase/getAllCandidate';
import { fetchCategories, fetchSubCategories, fetchDesignations } from '../../redux/slice/dailyActivity/getDropdown';
import ConfirmModal from "../../components/common/ConfirmModal";
import Footer from "../../components/common/Footer";
import { addNotification } from '../../components/common/notificationHelper';
import CandidateAssignPageView from '../../components/common/CandidateAssignPageView';

const CandidateTable = ({ searchQuery = "", onViewCandidate }) => {
  const dispatch = useDispatch();
  const { candidates, loading, error, pagination } = useSelector((state) => state.candidateData);
  const { categories, subCategories, designations } = useSelector((state) => state.dropdown);

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  
  const [selectedCandidateForPageView, setSelectedCandidateForPageView] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ category: '', subCategory: '', designation: '' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchAllCandidates({ page: currentPage, limit: 5, search: searchQuery }));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [dispatch, currentPage, searchQuery]);

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || "database.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Download failed!");
    }
  };

  const handleViewClick = (candidate) => {
    if (onViewCandidate) {
      onViewCandidate(candidate);
    } else {
      setSelectedCandidateForPageView(candidate);
    }
  };

  const handleDeleteClick = (candidate) => {
    setCandidateToDelete(candidate);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (candidateToDelete) {
      dispatch(deleteCandidateDatabase(candidateToDelete._id));
      addNotification(
        "Candidate Deleted",
        `Candidate record for ${candidateToDelete.category?.name || "N/A"} - ${candidateToDelete.designation?.name || "N/A"} deleted.`,
        `The candidate record under Category "${candidateToDelete.category?.name || "N/A"}" and Designation "${candidateToDelete.designation?.name || "N/A"}" has been successfully removed.`,
        "bg-red-50"
      );
    }
    setDeleteModalOpen(false);
    setCandidateToDelete(null);
  };

  const handleEditClick = (candidate) => {
    setCandidateToEdit(candidate);
    setEditForm({
      category: candidate.category?._id || '',
      subCategory: candidate.subCategory?._id || '',
      designation: candidate.designation?._id || ''
    });

    if (candidate.category?._id) {
      dispatch(fetchSubCategories({ categoryId: candidate.category._id, rowId: "editModal" }));
    }
    if (candidate.subCategory?._id) {
      dispatch(fetchDesignations({ subCategoryId: candidate.subCategory._id, rowId: "editModal" }));
    }

    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (candidateToEdit) {
      const selectedCategory = categories.find(c => c._id === editForm.category);
      const selectedSubCategory = subCategories["editModal"]?.find(s => s._id === editForm.subCategory);
      const selectedDesignation = designations["editModal"]?.find(d => d._id === editForm.designation);

      const updatedCandidate = {
        _id: candidateToEdit._id,
        category: { ...candidateToEdit.category, _id: editForm.category, name: selectedCategory?.name || candidateToEdit.category?.name || '' },
        subCategory: { ...candidateToEdit.subCategory, _id: editForm.subCategory, name: selectedSubCategory?.name || candidateToEdit.subCategory?.name || '' },
        designation: { ...candidateToEdit.designation, _id: editForm.designation, name: selectedDesignation?.name || candidateToEdit.designation?.name || '' },
      };
      dispatch(updateCandidateLocally(updatedCandidate));
      toast.success("Candidate record updated successfully.");
      addNotification(
        "Candidate Updated",
        `Candidate record updated successfully.`,
        `Candidate record updated. Category: "${selectedCategory?.name || 'N/A'}", Sub-Category: "${selectedSubCategory?.name || 'N/A'}", Designation: "${selectedDesignation?.name || 'N/A'}".`,
        "bg-blue-50"
      );
    }
    setEditModalOpen(false);
    setCandidateToEdit(null);
  };

  // If Candidate Assign Page View is active locally
  if (selectedCandidateForPageView) {
    return (
      <CandidateAssignPageView
        candidate={selectedCandidateForPageView}
        onBack={() => setSelectedCandidateForPageView(null)}
      />
    );
  }

  return (
    <div className=" space-y-3">
      <div className=" rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-bold text-gray-500">Sr. No</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500">Category</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 ">Sub Category</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500">Designation</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 text-center">Excel File</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr> <td colSpan={6} className="py-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin w-10 h-10 border-b-3 border-purple-700 rounded-full mb-3" />
                      <p className="text-sm text-gray-500 font-medium tracking-wide">Fetching data...</p>
                    </div>
                  </td></tr>
              ) : candidates?.length > 0 ? (
                candidates
                  .filter(item => {
                    if (!searchQuery || searchQuery.trim() === '') return true;
                    
                    const q = searchQuery.toLowerCase().trim();
                    const catName = item.category?.name?.toLowerCase() || "";
                    const subName = item.subCategory?.name?.toLowerCase() || "";
                    const desName = item.designation?.name?.toLowerCase() || "";

                    const hasNonItQuery = q.includes("non-it") || q.includes("non it") || q.includes("nonit");
                    const hasItQuery = q.includes("it");

                    if (hasNonItQuery) {
                      return catName.includes("non-it") || catName.includes("non it") || catName.includes("nonit") ||
                             subName.includes("non-it") || subName.includes("non it") || subName.includes("nonit") ||
                             desName.includes("non-it") || desName.includes("non it") || desName.includes("nonit");
                    } else if (hasItQuery) {
                      const isIt = (name) => {
                        return (name === "it" || name.includes("it ") || name.includes(" it")) && 
                                !(name.includes("non-it") || name.includes("non it") || name.includes("nonit"));
                      };
                      return isIt(catName) || isIt(subName) || isIt(desName);
                    }
                    
                    return true; // Let backend handle other searches
                  })
                  .map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{(currentPage - 1) * 5 + index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{item.category?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.subCategory?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.designation?.name}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <button
                        onClick={() => handleDownload(item.fileUrl, item.fileName)}
                        className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border hover:cursor-pointer border-green-200 hover:bg-green-100"
                      >
                        <FileSpreadsheet size={16} />
                        <span className="max-w-[100px] truncate text-xs font-semibold">{item.fileName || 'Download'}</span>
                        <Download size={14} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleViewClick(item)}
                          className="p-1.5 text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(item)}
                          className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Image Styled Pagination */}
        <div className="px-6 py-6 border-t border-gray-100 flex justify-end">
          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Page Numbers */}
            {[...Array(pagination?.totalPages || 1)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm ${
                    currentPage === pageNum
                      ? "bg-[#9333ea] text-white border-[#9333ea]" 
                      : "bg-[#ffffff] text-gray-600 border border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              disabled={currentPage >= (pagination?.totalPages || 1)}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Candidate"
        message="Are you sure you want to delete this candidate record? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Edit Candidate Record</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={editForm.category}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditForm({ ...editForm, category: val, subCategory: '', designation: '' });
                    if (val) {
                      dispatch(fetchSubCategories({ categoryId: val, rowId: "editModal" }));
                    }
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                <select
                  required
                  value={editForm.subCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditForm({ ...editForm, subCategory: val, designation: '' });
                    if (val) {
                      dispatch(fetchDesignations({ subCategoryId: val, rowId: "editModal" }));
                    }
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Sub Category</option>
                  {subCategories["editModal"]?.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select
                  required
                  value={editForm.designation}
                  onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Designation</option>
                  {designations["editModal"]?.map((des) => (
                    <option key={des._id} value={des._id}>{des.name}</option>
                  ))}
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

export default CandidateTable;