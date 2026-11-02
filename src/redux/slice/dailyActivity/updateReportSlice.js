import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token"); 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchReportById = createAsyncThunk(
  "updateReport/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/hr/daily-report/getReportById/${id}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch report data";
      return rejectWithValue(message);
    }
  }
);

export const updateDailyReport = createAsyncThunk(
  "updateReport/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      
      const response = await axios.put(
        `${BASE_URL}/api/hr/daily-report/updateReport/${id}`,
        payload,
        getAuthHeader()
      );
      
      toast.success("Daily Report Updated Successfully!");
      return response.data;
    } catch (error) {
      // const message = error.response?.data?.message || "Something went wrong while updating";
      
      // // Error Toast
      // toast.error(message);
      // return rejectWithValue(message);




      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong while updating" });
    }
  }
);

const updateReportSlice = createSlice({
  name: "updateReport",
  initialState: {
    reportData: null,
    loading: false,
    updating: false,
    success: false,
    error: null,
  },
  reducers: {
    resetUpdateStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    clearReportData: (state) => {
      state.reportData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateDailyReport.pending, (state) => {
        state.updating = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateDailyReport.fulfilled, (state) => {
        state.updating = false;
        state.success = true;
      })
      .addCase(updateDailyReport.rejected, (state, action) => {
        state.updating = false;
        state.success = false;
        state.error = action.payload;

        const apiError = action.payload;

        if (apiError?.errors && Array.isArray(apiError.errors)) {
          apiError.errors.forEach((msg) => {
            toast.error(msg);
          });
        } else if (apiError?.message) {
          toast.error(apiError.message);
        } else {
          toast.error("Update failed. Please try again.");
        }
      });
  },
});

export const { resetUpdateStatus, clearReportData } = updateReportSlice.actions;
export default updateReportSlice.reducer;