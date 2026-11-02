import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchCategories = createAsyncThunk("dropdown/categories", async () => {
  const res = await axios.get(`${BASE_URL}/api/hr/daily-report/getCategories`, getAuthHeader());
  return res.data.data;
});

export const fetchSubCategories = createAsyncThunk("dropdown/subCategories", async ({ categoryId, rowId }) => {
  const res = await axios.get(`${BASE_URL}/api/hr/daily-report/getSubCategories/${categoryId}`, getAuthHeader());
  return { data: res.data.data, rowId };
});

export const fetchDesignations = createAsyncThunk("dropdown/designations", async ({ subCategoryId, rowId }) => {
  const res = await axios.get(`${BASE_URL}/api/hr/daily-report/getDesignations/${subCategoryId}`, getAuthHeader());
  return { data: res.data.data, rowId };
});

export const fetchInteractionTypes = createAsyncThunk("dropdown/interactions", async () => {
  const res = await axios.get(`${BASE_URL}/api/hr/daily-report/getInteractionTypes`, getAuthHeader());
  return res.data.data;
});

export const fetchStatuses = createAsyncThunk("dropdown/statuses", async () => {
  const res = await axios.get(`${BASE_URL}/api/hr/daily-report/getCandidateStatuses`, getAuthHeader());
  return res.data.data;
});

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState: {
    categories: [],
    subCategories: {},
    designations: {}, 
    interactions: [],
    statuses: [],
    loading: false,
  },
  reducers: {
    clearRowData: (state, action) => {
      delete state.subCategories[action.payload];
      delete state.designations[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
      .addCase(fetchInteractionTypes.fulfilled, (state, action) => { state.interactions = action.payload; })
      .addCase(fetchStatuses.fulfilled, (state, action) => { state.statuses = action.payload; })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.subCategories[action.payload.rowId] = action.payload.data;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.designations[action.payload.rowId] = action.payload.data;
      });
  },
});

export const { clearRowData } = dropdownSlice.actions;
export default dropdownSlice.reducer;