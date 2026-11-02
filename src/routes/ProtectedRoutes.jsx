import { Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../modules/dashboard/Dashboard";
import Settings from "../modules/Settings/Settings";
import CandidateDatabase from "../modules/candidateDatabase/CandidateDatabase";
import AssignedCandidates from "../modules/candidateDatabase/AssignedCandidates";
import DailyActivity from "../modules/dailyActivity/DailyActivity";
import Profile from "../modules/profile/Profile";
import Notification from "../modules/notification/Notification";
import ViewDailyActivity from "../modules/dailyActivity/ViewDailyActivity";
import AddDailyWorkReport from "../modules/dailyActivity/AddDailyWorkReport";
import UpdateDailyActivity from "../modules/dailyActivity/UpdateDailyActivity";
// import CandidateDetails from "../modules/candidateDatabase/CandidateDetails";
// import ViewAllCandidate from "../modules/candidateDatabase/ViewAllCandidate";
import CandidateAssignPageView from "../components/common/CandidateAssignPageView";
import Jobseeker from "../modules/jobseeker/Jobseeker";
import CandidateDetails from "../modules/jobseeker/CandidateDetails";
import ViewAllCandidate from "../modules/jobseeker/ViewAllCandidate";
import VacancyList from "../modules/vacancy/VacancyList";
import PostVacancy from "../modules/vacancy/PostVacancy";
import ApplyCandidate from "../modules/vacancy/ApplyCandidate";
import ViewSubmittedApplications from "../modules/vacancy/ViewSubmittedApplications";
import SubmittedApplicationDetails from "../modules/vacancy/SubmittedApplicationDetails";

const ProtectedRoutes = () => {
  return [
    <Route key="main" path="/" element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="settings" element={<Settings />} />
      <Route path="candidate" element={<CandidateDatabase />} />
      <Route path="candidate/view/:id" element={<CandidateAssignPageView />} />
      <Route path="assigned-candidates" element={<AssignedCandidates />} />

      <Route path="job-seeker" element={<Jobseeker/>} /> 
      <Route path="job-seeker/candidate/getall/:id" element={<ViewAllCandidate/>} />
      <Route path="job-seeker/candidate/view/:id" element={<CandidateDetails/>} />

      <Route path="vacancies" element={<VacancyList />} />
      <Route path="vacancies/post" element={<PostVacancy />} />
      <Route path="vacancies/apply/:id" element={<ApplyCandidate />} />
      <Route path="vacancies/view/:id" element={<ViewSubmittedApplications />} />
      <Route path="vacancies/application-details/:appId" element={<SubmittedApplicationDetails />} />

      <Route path="activity" element={<DailyActivity />} />
      <Route path="activity/view/:id" element={<ViewDailyActivity />} />
      <Route path="activity/add" element={<AddDailyWorkReport />} />
      <Route path="activity/edit/:id" element={<UpdateDailyActivity />} />

      <Route path="profile" element={<Profile />} />
      <Route path="profile/edit" element={<Profile />} />

      <Route path="notification" element={<Notification />} />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Route>
  ];
};

export default ProtectedRoutes;