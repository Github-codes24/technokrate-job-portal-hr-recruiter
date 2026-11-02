import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/hr/auth/verify-otp`,
        otpData
      );
      if (response.data) {
        toast.success(response.data.message || "OTP verified successfully");
      }
      return response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || "Invalid OTP";
      toast.error(errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

const verifyOtpSlice = createSlice({
  name: "verifyOtp",
  initialState: {
    loading: false,
    success: false,
    error: null,
    emailForReset: localStorage.getItem("resetEmail") || "", // ईमेल स्टोर करने के लिए
  },
  reducers: {
    setResetEmail: (state, action) => {
      state.emailForReset = action.payload;
      localStorage.setItem("resetEmail", action.payload);
    },
    resetVerifyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setResetEmail, resetVerifyState } = verifyOtpSlice.actions;
export default verifyOtpSlice.reducer;