import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createDailyReport = createAsyncThunk(
  "report/createDailyReport",
  async (formData, { rejectWithValue }) => {
    try {

      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_URL}/api/hr/daily-report/createDailyReport`,formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || { message: "Network Error"});
    }
  }
);

const addReportSlice = createSlice({
  name: "addReport",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetReportStatus: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDailyReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDailyReport.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      toast.success("Report Added Successfully!")
      })
      .addCase(createDailyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // toast.error(action.payload?.message || "Submission failed");

        const payload = action.payload;

        if (payload?.errors && Array.isArray(payload.errors)) {
          payload.errors.forEach((err) => {
            toast.error(err);
          });
        } else if (payload?.message) {
          toast.error(payload.message);
        } else {
          toast.error("Something went wrong!");
        }
      });
  },
});

export const { resetReportStatus } = addReportSlice.actions;
export default addReportSlice.reducer;