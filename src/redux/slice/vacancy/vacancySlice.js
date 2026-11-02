import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://new-job-portal-be.onrender.com";

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchVacancies = createAsyncThunk(
  "vacancy/fetchVacancies",
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please login.");

      const {
        page = 1,
        limit = 10,
        search = "",
        category = "",
        workMode = "",
        hiring = "",
        state = "",
        city = "",
      } = params;

      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (search) queryParams.append("search", search);
      if (category && category !== "All") queryParams.append("category", category);
      if (workMode && workMode !== "All") queryParams.append("workMode", workMode);
      if (hiring && hiring !== "All") queryParams.append("hiring", hiring);
      if (state) queryParams.append("state", state);
      if (city) queryParams.append("city", city);

      const response = await axios.get(
        `${BASE_URL}/api/hr/vacancies?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch vacancies";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleVacancy = createAsyncThunk(
  "vacancy/fetchSingleVacancy",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please login.");

      const response = await axios.get(`${BASE_URL}/api/hr/vacancies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch vacancy details";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const submitCandidateApplicationApi = createAsyncThunk(
  "vacancy/submitCandidateApplicationApi",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const targetId = id || payload?.vacancyId || payload?.vacancy;

      if (!token) {
        toast.info("Offline demo mode: Candidate application saved locally.");
        return { success: true, data: { ...payload, _id: `DEMO-${Date.now()}`, applicationId: `APP-${Math.floor(100 + Math.random() * 900)}` } };
      }

      const response = await axios.post(
        `${BASE_URL}/api/hr/vacancies/${targetId}/apply`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data?.message || "Application submitted successfully");
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to submit application";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchVacancyApplications = createAsyncThunk(
  "vacancy/fetchVacancyApplications",
  async ({ id, params = {} }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please login.");

      const {
        page = 1,
        limit = 10,
        search = "",
        noticePeriod = "",
        status = "",
        state = "",
        city = "",
      } = params;

      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", page);
      if (limit) queryParams.append("limit", limit);
      if (search) queryParams.append("search", search);
      if (noticePeriod && noticePeriod !== "All") queryParams.append("noticePeriod", noticePeriod);
      if (status && status !== "All") queryParams.append("status", status);
      if (state) queryParams.append("state", state);
      if (city) queryParams.append("city", city);

      const response = await axios.get(
        `${BASE_URL}/api/hr/vacancies/${id}/applications?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch vacancy applications";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleApplicationDetails = createAsyncThunk(
  "vacancy/fetchSingleApplicationDetails",
  async (applicationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found. Please login.");

      const response = await axios.get(
        `${BASE_URL}/api/hr/vacancies/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch application details";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// ── Helper functions for localStorage fallback ──────────────────────────────

const vacancySlice = createSlice({
  name: "vacancy",
  initialState: {
    vacancies: [],
    applications: [],
    currentVacancy: null,
    currentApplication: null,
    pagination: {
      currentPage: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    applicationsPagination: {
      currentPage: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    loading: false,
    error: null,
  },
  reducers: {
    addVacancy: (state, action) => {
      const newVac = {
        id: `VAC-${100 + state.vacancies.length + 1}`,
        submittedCount: 0,
        postedDate: new Date().toISOString().split("T")[0],
        status: "Active",
        ...action.payload,
      };
      state.vacancies.unshift(newVac);
    },
    submitCandidateApplication: (state, action) => {
      const newApp = {
        id: `APP-${Date.now()}`,
        status: action.payload.status || "Accepted",
        location: action.payload.location || "Mukhed",
        submittedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.applications.unshift(newApp);

      const targetVac = state.vacancies.find((v) => (v._id === action.payload.vacancyId || v.id === action.payload.vacancyId));
      if (targetVac) {
        targetVac.submittedCount = (targetVac.submittedCount || 0) + 1;
      }
    },
    updateApplicationStatus: (state, action) => {
      const { id, status } = action.payload;
      const app = state.applications.find((a) => a.id === id || a._id === id);
      if (app) {
        app.status = status;
      }
    },
    deleteApplication: (state, action) => {
      const id = action.payload;
      const appToDelete = state.applications.find((a) => a.id === id);
      if (appToDelete) {
        const targetVac = state.vacancies.find((v) => (v._id === appToDelete.vacancyId || v.id === appToDelete.vacancyId));
        if (targetVac && (targetVac.submittedCount > 0 || targetVac.applicationSubmittedCount > 0)) {
          if (targetVac.submittedCount) targetVac.submittedCount -= 1;
          if (targetVac.applicationSubmittedCount) targetVac.applicationSubmittedCount -= 1;
          saveVacanciesToStorage(state.vacancies);
        }
        state.applications = state.applications.filter((a) => a.id !== id);
        saveApplicationsToStorage(state.applications);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.loading = false;
        const apiData = action.payload?.data || [];
        
        if (apiData.length > 0) {
          // Normalize backend fields for legacy UI compatibility while preserving API fields
          const formattedVacancies = apiData.map((item) => ({
            ...item,
            id: item.vacancyId || item._id,
            hiring: item.hiring || "",
            profile: item.designation || item.profile,
            location: item.city || item.location,
            candidatesCount: item.numberOfVacancies ?? item.candidatesCount ?? 0,
            submittedCount: item.applicationSubmittedCount ?? item.submittedCount ?? 0,
            deadline: item.deadline ? item.deadline.split("T")[0] : "",
          }));

          state.vacancies = formattedVacancies;
        }

        if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleVacancy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleVacancy.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload?.data;
        if (item) {
          const formatted = {
            ...item,
            id: item.vacancyId || item._id,
            hiring: item.hiring || "",
            profile: item.designation || item.profile,
            location: item.city || item.location,
            candidatesCount: item.numberOfVacancies ?? item.candidatesCount ?? 0,
            submittedCount: item.applicationSubmittedCount ?? item.submittedCount ?? 0,
            deadline: item.deadline ? item.deadline.split("T")[0] : "",
          };
          state.currentVacancy = formatted;
        }
      })
      .addCase(fetchSingleVacancy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitCandidateApplicationApi.fulfilled, (state, action) => {
        state.loading = false;
        const newApp = action.payload?.data;
        if (newApp) {
          state.applications.unshift({
            ...newApp,
            id: newApp.applicationId || newApp._id,
            fullName: newApp.fullName,
            email: newApp.email,
            phone: newApp.phone,
            experience: newApp.totalExperience,
            currentCompany: newApp.currentOrganization,
            currentCtc: newApp.currentCTC,
            expectedSalary: newApp.expectedCTC,
            noticePeriod: newApp.noticePeriod,
            state: newApp.state,
            city: newApp.city,
            referredByHr: newApp.referredBy,
            cvDriveLink: newApp.resumeLink,
            coverNote: newApp.recruiterNotes,
            submittedAt: newApp.createdAt || new Date().toISOString(),
          });
        }
        const updatedCount = action.payload?.applicationSubmittedCount;
        if (updatedCount !== undefined && newApp?.vacancy) {
          const targetVac = state.vacancies.find(
            (v) => v._id === newApp.vacancy || v.id === newApp.vacancyCode || v.vacancyId === newApp.vacancyCode
          );
          if (targetVac) {
            targetVac.submittedCount = updatedCount;
            targetVac.applicationSubmittedCount = updatedCount;
          }
        }
      })
      .addCase(fetchVacancyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancyApplications.fulfilled, (state, action) => {
        state.loading = false;
        const vacancy = action.payload?.vacancy;
        if (vacancy) {
          state.currentVacancy = {
            ...vacancy,
            id: vacancy.vacancyId || vacancy._id,
            hiring: vacancy.hiring || "",
            profile: vacancy.designation || vacancy.profile,
            location: vacancy.city || vacancy.location,
            candidatesCount: vacancy.numberOfVacancies ?? vacancy.candidatesCount ?? 0,
            submittedCount: vacancy.applicationSubmittedCount ?? vacancy.submittedCount ?? 0,
            deadline: vacancy.deadline ? vacancy.deadline.split("T")[0] : "",
          };
        }

        const items = action.payload?.data || [];
        const formatted = items.map((app) => ({
          ...app,
          id: app.applicationId || app._id,
          vacancyId: app.vacancyCode || app.vacancy || vacancy?.vacancyId || vacancy?._id,
          fullName: app.fullName,
          email: app.email,
          phone: app.phone,
          experience: app.totalExperience,
          currentCompany: app.currentOrganization,
          currentCtc: app.currentCTC,
          expectedSalary: app.expectedCTC,
          noticePeriod: app.noticePeriod,
          state: app.state,
          city: app.city,
          location: app.city ? (app.state ? `${app.city}, ${app.state}` : app.city) : app.location,
          referredByHr: app.referredBy,
          cvDriveLink: app.resumeLink,
          coverNote: app.recruiterNotes,
          submittedAt: app.createdAt || new Date().toISOString(),
        }));
        state.applications = formatted;

        if (action.payload?.pagination) {
          state.applicationsPagination = action.payload.pagination;
        }
      })
      .addCase(fetchVacancyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleApplicationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleApplicationDetails.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload?.data;
        if (item) {
          const formatted = {
            ...item,
            id: item.applicationId || item._id,
            vacancyId: item.vacancyCode || item.vacancy?.vacancyId || item.vacancy?._id || item.vacancy,
            vacancyProfile: item.vacancy?.designation || item.vacancy?.profile || item.vacancyCode,
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            experience: item.totalExperience,
            totalExperience: item.totalExperience,
            currentCompany: item.currentOrganization,
            currentOrganization: item.currentOrganization,
            currentCtc: item.currentCTC,
            currentCTC: item.currentCTC,
            expectedSalary: item.expectedCTC,
            expectedCTC: item.expectedCTC,
            noticePeriod: item.noticePeriod,
            state: item.state,
            city: item.city,
            location: item.city ? (item.state ? `${item.city}, ${item.state}` : item.city) : item.location,
            referredByHr: item.referredBy,
            referredBy: item.referredBy,
            cvDriveLink: item.resumeLink,
            resumeLink: item.resumeLink,
            coverNote: item.recruiterNotes,
            recruiterNotes: item.recruiterNotes,
            submittedAt: item.createdAt,
          };
          state.currentApplication = formatted;
        }
      })
      .addCase(fetchSingleApplicationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addVacancy,
  submitCandidateApplication,
  updateApplicationStatus,
  deleteApplication,
} = vacancySlice.actions;

export default vacancySlice.reducer;
