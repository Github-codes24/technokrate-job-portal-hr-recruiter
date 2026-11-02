import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/common/Footer";
import { Camera, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { addNotification } from "../../components/common/notificationHelper";
import { fetchHRProfile, updateHRProfile, setProfileData } from "../../redux/slice/profile/profileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { data: hrProfile, loading, updating, error } = useSelector((state) => state.profile);

  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse userProfile from localStorage", e);
    }
    return {
      name: "",
      designation: "",
      mobileNumber: "",
      email: "",
      password: "",
      profilePic: "",
      isActive: true,
    };
  });

  const [form, setForm] = useState({ ...profile });

  // Fetch HR Profile from API on mount
  useEffect(() => {
    dispatch(fetchHRProfile());
  }, [dispatch]);

  // Sync state when HR profile is fetched from API
  useEffect(() => {
    if (hrProfile) {
      const mapped = {
        id: hrProfile.id || hrProfile._id || "",
        name: hrProfile.hrName || hrProfile.name || "",
        hrName: hrProfile.hrName || hrProfile.name || "",
        designation: hrProfile.designation || "",
        mobileNumber: hrProfile.mobileNumber || "",
        email: hrProfile.email || "",
        password: hrProfile.showPassword || hrProfile.password || "",
        showPassword: hrProfile.showPassword || hrProfile.password || "",
        profilePic:
          hrProfile.image?.url ||
          (typeof hrProfile.image === "string" ? hrProfile.image : "") ||
          hrProfile.profilePic ||
          "",
        image: hrProfile.image || { url: "", public_id: "" },
        isActive: hrProfile.isActive ?? true,
        createdAt: hrProfile.createdAt,
      };
      setProfile(mapped);
      setForm(mapped);
    }
  }, [hrProfile]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const stored = localStorage.getItem("userProfile");
        if (stored) {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
          setForm(parsed);
        }
      } catch (e) {
        console.error("Failed to parse userProfile in Profile listener", e);
      }
    };

    window.addEventListener("profileUpdate", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdate", handleProfileUpdate);
    };
  }, []);

  const handleSave = async () => {
    let payload;

    if (selectedImageFile) {
      // Send multipart/form-data for file upload
      const formData = new FormData();
      if (form.name || form.hrName) formData.append("hrName", form.name || form.hrName);
      if (form.designation) formData.append("designation", form.designation);
      if (form.mobileNumber) formData.append("mobileNumber", form.mobileNumber);
      if (form.email) formData.append("email", form.email);
      if (form.password) formData.append("password", form.password);
      formData.append("image", selectedImageFile);
      payload = formData;
    } else {
      // Send JSON if no new file is being uploaded
      const jsonPayload = {};
      if (form.name || form.hrName) jsonPayload.hrName = form.name || form.hrName;
      if (form.designation) jsonPayload.designation = form.designation;
      if (form.mobileNumber) jsonPayload.mobileNumber = form.mobileNumber;
      if (form.email) jsonPayload.email = form.email;
      if (form.password) jsonPayload.password = form.password;
      if (form.profilePic === "") {
        jsonPayload.image = "";
      }
      payload = jsonPayload;
    }

    try {
      const resultAction = await dispatch(updateHRProfile(payload));
      if (updateHRProfile.fulfilled.match(resultAction)) {
        toast.success(resultAction.payload?.message || "Profile updated successfully!");
        addNotification(
          "Profile Updated",
          "Your profile has been updated successfully.",
          `Name: ${form.name || form.hrName}, Designation: ${form.designation}, Email ID: ${form.email}.`,
          "bg-blue-50"
        );
        setSelectedImageFile(null);
        setEditing(false);
      } else {
        toast.error(resultAction.payload || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedImageFile(null);
    setForm((prev) => ({ ...prev, profilePic: "" }));
  };

  const fields = [
    { label: "Name :", key: "name", type: "text" },
    { label: "Designation :", key: "designation", type: "text" },
    { label: "Mobile Number :", key: "mobileNumber", type: "text" },
    { label: "Email ID :", key: "email", type: "email" },
    { label: "Password :", key: "password", type: "password" },
  ];

  const displayPhoto = editing ? form.profilePic : profile.profilePic;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 w-full mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => dispatch(fetchHRProfile())}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh profile from server"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => dispatch(fetchHRProfile())}
              className="text-red-700 font-semibold underline hover:text-red-900 ml-3"
            >
              Retry
            </button>
          </div>
        )}

        {loading && !profile.name ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#7900BA] animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading profile details...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            {/* Inner card */}
            <div className="bg-gray-100 rounded-xl p-6 mb-4">
              {/* Avatar & Header Info */}
              <div className="mb-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group w-28 h-28">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-purple-50 border-4 border-white shadow">
                    <img
                      src={
                        displayPhoto ||
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112' viewBox='0 0 112 112'%3E%3Ccircle cx='56' cy='56' r='56' fill='%23d1d5db'/%3E%3Ccircle cx='56' cy='44' r='20' fill='%239ca3af'/%3E%3Cellipse cx='56' cy='95' rx='32' ry='22' fill='%239ca3af'/%3E%3C/svg%3E"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='112' viewBox='0 0 112 112'%3E%3Ccircle cx='56' cy='56' r='56' fill='%23d1d5db'/%3E%3Ccircle cx='56' cy='44' r='20' fill='%239ca3af'/%3E%3Cellipse cx='56' cy='95' rx='32' ry='22' fill='%239ca3af'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  {editing && (
                    <label className="absolute inset-0 bg-black/55 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-xs font-semibold gap-1">
                      <Camera size={20} />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                </div>

                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {editing ? form.name || "HR Recruiter" : profile.name || "HR Recruiter"}
                    </h2>
                    {profile.isActive !== undefined && (
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          profile.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {profile.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {editing ? form.designation || "HR" : profile.designation || "HR"}
                  </p>
                  {profile.email && (
                    <p className="text-xs text-gray-400">{profile.email}</p>
                  )}
                </div>

                {editing && (
                  <div className="flex flex-col gap-2 sm:ml-auto">
                    <label className="bg-[#7900BA] hover:bg-purple-800 text-white px-4 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-2 text-sm font-semibold transition-colors w-max shadow-sm">
                      <Camera size={16} />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                    {form.profilePic && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold transition-colors w-max"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="flex flex-col gap-5">
                {fields.map(({ label, key, type }) => (
                  <div key={key} className="flex items-center gap-4">
                    <span className="w-36 text-sm font-bold text-gray-700 shrink-0">
                      {label}
                    </span>
                    {editing ? (
                      <div className="flex-1 relative flex items-center">
                        <input
                          type={key === "password" ? (showPassword ? "text" : "password") : type}
                          value={form[key] || ""}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full text-sm text-gray-600 bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                        />
                        {key === "password" && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {key === "password"
                            ? showPassword
                              ? profile[key] || "—"
                              : "••••••••"
                            : profile[key] || "—"}
                        </span>
                        {key === "password" && profile[key] && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                            title={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit / Save Button */}
        <div className="flex justify-center mt-6">
          {editing ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(false);
                  setSelectedImageFile(null);
                  setForm({ ...profile });
                }}
                className="px-10 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updating}
                className="px-10 py-3 rounded-xl bg-[#7900BA] text-white font-semibold text-sm hover:bg-purple-700 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {updating && <Loader2 size={16} className="animate-spin" />}
                <span>{updating ? "Saving..." : "Save"}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setForm({ ...profile });
                setEditing(true);
              }}
              className="px-16 py-3 rounded-xl bg-[#7900BA] text-white font-semibold text-sm hover:bg-purple-700 transition cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Profile;