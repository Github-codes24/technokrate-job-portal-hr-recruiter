import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchReportById = createAsyncThunk(
  "reportById/fetchReportById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/hr/daily-report/getReportById/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response?.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch report");
    }
  }
);

const getHrByIdSlice = createSlice({
  name: "reportById",
  initialState: {
    report: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReportState: (state) => {
      state.report = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload.data; 
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportState } = getHrByIdSlice.actions;
export default getHrByIdSlice.reducer;