import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slice/auth/loginSlice'
import {
  LayoutDashboard,
  User,
  UserCheck,
  LineChart,
  Settings,
  Briefcase,
  LogOut,
  UserCircle,
} from 'lucide-react'
import logo from '../../assets/technologo.svg'
import ConfirmModal from "../common/ConfirmModal";
import bottomicon from '../../assets/favicon.svg'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'candidate', label: 'Candidate Database', icon: User, path: '/candidate' },
  { id: 'assigned', label: 'Assigned Candidates', icon: UserCheck, path: '/assigned-candidates' },
  { id: 'jobseeker', label: 'Job Seeker', icon: Briefcase, path: '/job-seeker' },
  { id: 'vacancies', label: 'Current Vacancies', icon: Briefcase, path: '/vacancies' },
  { id: 'activity', label: 'Daily Activity', icon: LineChart, path: '/activity' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'profile', label: 'My Profile', icon: UserCircle, path: '/profile' },
]

const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleLogout = () => {
  //   setShowLogoutModal(false);
  //   navigate("/login");
  // };


  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    setShowLogoutModal(false);
    window.location.href = "/get-started";
  };
  return (
    <>
      <aside className="w-68 h-screen bg-gradient-to-b border-r border-purple-200 from-[#e6c5f1] to-[#8931BA] flex flex-col text-white font-sans">

        {/* Header / Logo */}
        <div className="bg-white p-4 mb-4 flex justify-center items-center">
          <NavLink to="/">
            <img src={logo} alt="Technokrate Hire" className="h-10 cursor-pointer" />
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-6 py-3 transition-all duration-200 ${isActive
                      ? 'bg-white/90 text-[#9333EA] rounded-lg border-l-4 border-[#7E22CE] font-bold'
                      : 'text-white/90 hover:bg-white/10 rounded-lg font-medium'
                    }`
                  }
                >
                  <item.icon size={22} />
                  <span className="text-md">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Branding & Logout */}
        <div className="p-6 space-y-6">
          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-white text-[#9333EA] py-3 px-8 rounded-xl flex items-center justify-center gap-3 font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Yes, Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Sidebar;