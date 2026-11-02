import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://new-job-portal-be.onrender.com";
import { toast } from "react-toastify";

export const requestHRLoginOtp = createAsyncThunk(
  "auth/requestHRLoginOtp",
  async ({ mobileNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/hr/auth/login`,
        { mobileNumber }   
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);      

export const verifyHRLoginOtp = createAsyncThunk(
  "auth/verifyHRLoginOtp",
  async ({ mobileNumber, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/hr/auth/login`,
        { mobileNumber, otp }
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);


export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/hr/auth/login`,
        { email, password }
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid email or password");
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.success = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestHRLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestHRLoginOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestHRLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyHRLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyHRLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        toast.success("Login Successfully!");
      })
      .addCase(verifyHRLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        toast.success("Login Successfully!");
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;