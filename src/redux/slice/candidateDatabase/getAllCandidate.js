import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllCandidates = createAsyncThunk(
  "candidates/fetchAllCandidates",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please login.");

      // Dynamic URL with Search and Pagination
      const response = await axios.get(
        `${BASE_URL}/api/hr/candidate-database/getAllCandidateDatabase?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch candidates"
      );
    }
  }
);

export const deleteCandidateDatabase = createAsyncThunk(
  "candidates/deleteCandidateDatabase",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please login.");

      const response = await axios.delete(
        `${BASE_URL}/api/hr/candidate-database/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return { id, message: response.data?.message || "Candidate record deleted successfully." };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete candidate database"
      );
    }
  }
);

const getAllCandidateSlice = createSlice({
  name: "getAllCandidate",
  initialState: {
    candidates: [],
    pagination: {
      total: 0,
      totalPages: 1,
      currentPage: 1
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearCandidateState: (state) => {
      state.candidates = [];
      state.error = null;
    },
    removeCandidateLocally: (state, action) => {
      state.candidates = state.candidates.filter(c => c._id !== action.payload);
    },
    updateCandidateLocally: (state, action) => {
      const index = state.candidates.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.data || [];
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.page
        };
      })
      .addCase(fetchAllCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCandidateDatabase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCandidateDatabase.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = state.candidates.filter(c => c._id !== action.payload.id);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        toast.success(action.payload.message);
      })
      .addCase(deleteCandidateDatabase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to delete candidate record");
      });
  },
});

export const { clearCandidateState, removeCandidateLocally, updateCandidateLocally } = getAllCandidateSlice.actions;
export default getAllCandidateSlice.reducer;