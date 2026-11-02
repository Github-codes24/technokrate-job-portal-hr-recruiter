import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE_URL = RAW_BASE_URL.replace(/\/api\/?$/, "");

const normalizeAndCacheProfile = (profileData) => {
  if (!profileData) return null;
  const normalized = {
    id: profileData.id || profileData._id || "",
    _id: profileData._id || profileData.id || "",
    hrName: profileData.hrName || profileData.name || "",
    name: profileData.hrName || profileData.name || "",
    designation: profileData.designation || "",
    mobileNumber: profileData.mobileNumber || "",
    email: profileData.email || "",
    password: profileData.showPassword || profileData.password || "",
    showPassword: profileData.showPassword || profileData.password || "",
    profilePic:
      profileData.image?.url ||
      (typeof profileData.image === "string" ? profileData.image : "") ||
      profileData.profilePic ||
      "",
    image: profileData.image || { url: "", public_id: "" },
    isActive: profileData.isActive ?? true,
    createdAt: profileData.createdAt,
    updatedAt: profileData.updatedAt,
  };

  try {
    localStorage.setItem("userProfile", JSON.stringify(normalized));
    window.dispatchEvent(new Event("profileUpdate"));
  } catch (storageError) {
    console.error("Failed to update userProfile in localStorage", storageError);
  }

  return normalized;
};

// GET HR Profile
export const fetchHRProfile = createAsyncThunk(
  "profile/fetchHRProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/hr/auth/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileData = response.data?.data || response.data;
      normalizeAndCacheProfile(profileData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch HR profile"
      );
    }
  }
);

// UPDATE HR Profile
export const updateHRProfile = createAsyncThunk(
  "profile/updateHRProfile",
  async (updateData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const isFormData = updateData instanceof FormData;

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const response = await axios.put(
        `${BASE_URL}/api/hr/auth/update-profile`,
        updateData,
        { headers }
      );

      const profileData = response.data?.data || response.data;
      normalizeAndCacheProfile(profileData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update HR profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    updating: false,
    error: null,
    updateError: null,
    updateSuccess: false,
  },
  reducers: {
    setProfileData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    clearProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.updating = false;
      state.error = null;
      state.updateError = null;
      state.updateSuccess = false;
    },
    resetUpdateStatus: (state) => {
      state.updating = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchHRProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHRProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || action.payload;
        state.error = null;
      })
      .addCase(fetchHRProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateHRProfile.pending, (state) => {
        state.updating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateHRProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.data = action.payload?.data || action.payload;
        state.updateError = null;
      })
      .addCase(updateHRProfile.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.updateError = action.payload;
      });
  },
});

export const { setProfileData, clearProfile, resetUpdateStatus } = profileSlice.actions;
export default profileSlice.reducer;
