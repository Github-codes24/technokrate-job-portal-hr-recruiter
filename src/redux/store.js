import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../redux/slice/auth/loginSlice";
import forgotPassReducer from "../redux/slice/auth/forgotPassSlice"
import verifyOtpReducer from "../redux/slice/auth/verifyOtpSlice"
import resetPassReducer from "../redux/slice/auth/resetPassSlice"
import getHrReducer from "../redux/slice/dailyActivity/getHrSlice"
import getHrByIdReducer from "../redux/slice/dailyActivity/getHrByIdSlice"
import dropdownReducer from "../redux/slice/dailyActivity/getDropdown"
import updateReportReducer from "../redux/slice/dailyActivity/updateReportSlice"
// import updateReportReducer from "../redux/slice/dailyActivity/updateReportSlice"
// import uploadDatabaseReducer from "./slice/candidateDatabase/uploadDatabaseSlice"
import addReportReducer from "../redux/slice/dailyActivity/addReportSlice"
import databaseReducer from "../redux/slice/candidateDatabase/createDatabaseSlice"
import getAllCandidateReducer from "../redux/slice/candidateDatabase/getAllCandidate"

// job seeker
import categoryReducer from "../redux/slice/jobseeker/getAlljobSeekerCategory"
import profileReducer from "../redux/slice/profile/profileSlice";
import vacancyReducer from "../redux/slice/vacancy/vacancySlice";

export const store = configureStore({
  reducer: {
    auth: loginReducer,
    forgotPass: forgotPassReducer,
    verifyOtp: verifyOtpReducer,
    resetPass: resetPassReducer,
    reports: getHrReducer,
    reportById: getHrByIdReducer,

    dropdown: dropdownReducer,
    updateReport: updateReportReducer,

    addReport: addReportReducer,

    database: databaseReducer,
    candidateData: getAllCandidateReducer,

    // job seeker
    jobSeekerCategory: categoryReducer,
    profile: profileReducer,
    vacancy: vacancyReducer,
  },
}); 