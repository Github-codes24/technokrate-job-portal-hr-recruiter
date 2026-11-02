import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";
import { fetchJobSeekerCategories } from "../../redux/slice/jobseeker/getAlljobSeekerCategory";

const CategoryCard = ({ title, description, imageUrl, linkText, onClick }) => (
  <div
    onClick={onClick}
    className="border border-gray-200 rounded-lg shadow-sm p-5 text-center flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer group bg-white"
  >
    <div className="bg-purple-700 w-16 h-16 rounded-xl mb-4 group-hover:scale-110 transition-transform overflow-hidden flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
      ) : (
        <div className="text-white font-bold text-xl">{title[0]}</div>
      )}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-6 leading-relaxed">{description}</p>
    <button className="text-purple-600 font-medium flex items-center gap-1 hover:underline">
      {linkText} <ChevronRight size={16} />
    </button>
  </div>
);

const Jobseeker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.jobSeekerCategory
  );
  useEffect(() => {
    dispatch(fetchJobSeekerCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white p-4 font-sans shadow-sm">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Job Seeker</h1>
        <hr className="mb-8 border-gray-300" />

        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500 animate-pulse">Loading categories...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          {!loading && categories && categories.length > 0 ? (
            categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                title={cat.name}
                description={cat.description || "Explore various job opportunities"}
                imageUrl={cat.image}
                linkText={`Explore ${cat.name} roles`}
                onClick={() => navigate(`/job-seeker/candidate/getall/${cat._id}`)}
              />
            ))
          ) : (
            !loading && !error && <p className="text-gray-400">No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobseeker;