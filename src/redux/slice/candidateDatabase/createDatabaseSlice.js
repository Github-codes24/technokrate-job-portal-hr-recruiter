import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => ({
  headers: { 
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json", 
  },
});

export const uploadCandidateDatabase = createAsyncThunk(
  "database/upload",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/hr/candidate-database/uploadCandidateDatabase`, payload, getAuthHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const databaseSlice = createSlice({
  name: "database",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCandidateDatabase.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadCandidateDatabase.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        toast.success("Database Uploaded Successfully!")
      })
      .addCase(uploadCandidateDatabase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        const payload = action.payload;
        if (payload?.errors && Array.isArray(payload.errors)) {
          payload.errors.forEach((err) => {
            toast.error(err);
          });
        } else if (payload?.message) {
          toast.error(payload.message);
        } else if (typeof payload === "string") {
          toast.error(payload);
        } else {
          toast.error("Database upload failed. Please try again.");
        }
      });
  },
});

export const { resetStatus } = databaseSlice.actions;
export default databaseSlice.reducer;