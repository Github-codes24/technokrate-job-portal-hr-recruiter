import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMyReports = createAsyncThunk(
  "reports/fetchMyReports",
  async ({ page = 1, limit = 5, search = "", status = "",date="" }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/hr/daily-report/getMyReports?page=${page}&limit=${limit}&search=${search}&status=${status}&date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reports");
    }
  }
);

const getHrSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalReports: 0,
  },
  reducers: {
    resetReports: (state) => {
      state.reports = [];
      state.totalPages = 1;
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data || []; 
        state.totalPages = action.payload.pages || 1;
        state.currentPage = action.payload.page || 1;
        state.totalReports = action.payload.total || 0;
      })
      .addCase(fetchMyReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.reports = [];
        state.totalPages = 1;
        state.totalReports = 0;
      });
  },
});

export const { resetReports } = getHrSlice.actions;
export default getHrSlice.reducer;