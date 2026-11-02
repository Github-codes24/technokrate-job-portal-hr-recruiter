import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/hr/auth/send-otp`,
        emailData
      );
      if (response.data.OTP) {
        toast.success(`OTP Sent! Your OTP is: ${response.data.OTP}`, {
          autoClose: 10000,
        });
      }
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to send OTP";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

const forgotPassSlice = createSlice({
  name: "forgotPass",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetForgotState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetForgotState } = forgotPassSlice.actions;
export default forgotPassSlice.reducer;