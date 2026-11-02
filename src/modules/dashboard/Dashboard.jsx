import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Mail,
  Phone,
  Briefcase,
  TrendingUp,
  MoreHorizontal,
  Calendar,
  RotateCcw,
  CalendarDays,
  CalendarRange,
  UserCheck,
  UserPlus,
  UserX,
  Eye,
  Footprints,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  GitFork,
  PauseCircle,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import Footer from "../../components/common/Footer";

// ── Data ──────────────────────────────────────────────────────────────────────

const barData = [
  { day: "Mon", Calls: 9, Emails: 10 },
  { day: "Tue", Calls: 11, Emails: 13 },
  { day: "Wed", Calls: 20, Emails: 22 },
  { day: "Thurs", Calls: 22, Emails: 22 },
  { day: "Fri", Calls: 21, Emails: 20 },
];

const lineData = [
  { day: "Mon", value: 1000 },
  { day: "Tue", value: 1200 },
  { day: "Wed", value: 1100 },
  { day: "Thurs", value: 750 },
  { day: "Fri", value: 900 },
  { day: "Sat", value: 1000 },
];

const pieData = [
  { name: "Engineer", value: 40 },
  { name: "Designers", value: 25 },
  { name: "Sales", value: 10 },
  { name: "Marketing", value: 20 },
  { name: "Others", value: 5 },
];

const PIE_COLORS = ["#7C3AED", "#93C5FD", "#14B8A6", "#312E81", "#60A5FA"];

const hrActivities = [
  {
    name: "Sarah Johnson",
    role: "Senior React Developer",
    company: "TechCorp",
    action: "Called",
    color: "bg-purple-100 text-purple-700",
    time: "5min ago",
  },
  {
    name: "Michael Chen",
    role: "Product Designer",
    company: "DesignHub",
    action: "Called",
    color: "bg-purple-100 text-purple-700",
    time: "8min ago",
  },
  {
    name: "Emma Williams",
    role: "Marketing Manager",
    company: "BrandLab",
    action: "Emailed",
    color: "bg-yellow-100 text-yellow-700",
    time: "15min ago",
  },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, change, icon: Icon, iconBg }) {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-[0_8px_24px_-4px_rgba(0,0,0,0.18)] border border-gray-200/80 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.25)] transition-all duration-200 h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-600 tracking-tight truncate">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
        <TrendingUp size={14} />
        <span>{change} vs last month</span>
      </div>
    </div>
  );
}

// ── Custom Pie Legend ─────────────────────────────────────────────────────────

function PieLegend() {
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {pieData.map((entry, i) => (
        <li key={entry.name} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-sm inline-block"
            style={{ backgroundColor: PIE_COLORS[i] }}
          />
          <span className="text-gray-600">{entry.name}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans shadow-sm">
      {/* Page wrapper */}
      <div className=" mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Hello' TechnoHire</p>
          </div>
          <button
            onClick={() => navigate("/vacancies")}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md w-fit cursor-pointer"
          >
            <Briefcase size={18} />
            Work / Vacancies
          </button>
        </div>

        {/* Date Analytics Overview Section (Top Positioned with Project Purple Palette) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-700">
              <Calendar size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Date Analytics Overview</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* TODAY */}
            <div className="bg-gradient-to-br from-purple-50/90 to-purple-100/40 border border-purple-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
              <div>
                <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider block">TODAY</span>
                <span className="text-3xl font-extrabold text-purple-950 mt-1 block">0</span>
                <span className="text-xs font-semibold text-purple-600/90 mt-0.5 block">Today's Leads</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-xl flex items-center justify-center shadow-xs shrink-0">
                <CalendarDays size={22} />
              </div>
            </div>

            {/* YESTERDAY */}
            <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/50 border border-indigo-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
              <div>
                <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider block">YESTERDAY</span>
                <span className="text-3xl font-extrabold text-indigo-950 mt-1 block">1</span>
                <span className="text-xs font-semibold text-indigo-600/90 mt-0.5 block">Previous Day Leads</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-xs shrink-0">
                <RotateCcw size={22} />
              </div>
            </div>

            {/* IN WEEK */}
            <div className="bg-gradient-to-br from-fuchsia-50/90 to-purple-50/40 border border-fuchsia-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
              <div>
                <span className="text-xs font-extrabold text-fuchsia-700 uppercase tracking-wider block">IN WEEK</span>
                <span className="text-3xl font-extrabold text-fuchsia-950 mt-1 block">1</span>
                <span className="text-xs font-semibold text-fuchsia-600/90 mt-0.5 block">Current Week Leads</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-fuchsia-700 text-white rounded-xl flex items-center justify-center shadow-xs shrink-0">
                <CalendarRange size={22} />
              </div>
            </div>

            {/* IN MONTH */}
            <div className="bg-gradient-to-br from-purple-100/60 to-indigo-100/40 border border-purple-300/70 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all hover:shadow-md">
              <div>
                <span className="text-xs font-extrabold text-purple-900 uppercase tracking-wider block">IN MONTH</span>
                <span className="text-3xl font-extrabold text-purple-950 mt-1 block">9</span>
                <span className="text-xs font-semibold text-purple-700 mt-0.5 block">Current Month Leads</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-800 to-indigo-900 text-white rounded-xl flex items-center justify-center shadow-xs shrink-0">
                <Calendar size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Recruitment Pipeline & Status Section (6 Cards) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-700">
              <Users size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Candidate Pipeline & Status</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* 1. Processing */}
            <StatCard
              label="Processing"
              value="245"
              change="12.4%"
              icon={Loader2}
              iconBg="bg-purple-100 text-purple-700"
            />

            {/* 2. Selected */}
            <StatCard
              label="Selected"
              value="142"
              change="18.2%"
              icon={CheckCircle2}
              iconBg="bg-emerald-100 text-emerald-700"
            />

            {/* 3. Onboarding */}
            <StatCard
              label="Onboarding"
              value="64"
              change="15.1%"
              icon={UserCheck}
              iconBg="bg-blue-100 text-blue-700"
            />

            {/* 4. On Hold */}
            <StatCard
              label="On Hold"
              value="31"
              change="2.3%"
              icon={PauseCircle}
              iconBg="bg-amber-100 text-amber-700"
            />

            {/* 5. Rejected */}
            <StatCard
              label="Rejected"
              value="86"
              change="3.5%"
              icon={XCircle}
              iconBg="bg-rose-100 text-rose-600"
            />

            {/* 6. Not Interested */}
            <StatCard
              label="Not Interested"
              value="58"
              change="8.7%"
              icon={GitFork}
              iconBg="bg-indigo-100 text-indigo-700"
            />
          </div>
        </div>

        {/* Joining Schedule Tracker Section (3 Cards) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
              <CalendarCheck size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">Joining Schedule Tracker</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* 7. Today's Joining */}
            <StatCard
              label="Today's Joining"
              value="12"
              change="25.0%"
              icon={CalendarCheck}
              iconBg="bg-orange-100 text-orange-600"
            />

            {/* 8. Tomorrow's Joining */}
            <StatCard
              label="Tomorrow's Joining"
              value="18"
              change="14.0%"
              icon={CalendarDays}
              iconBg="bg-teal-100 text-teal-700"
            />

            {/* 9. In Week Joining */}
            <StatCard
              label="In Week Joining"
              value="45"
              change="20.5%"
              icon={CalendarRange}
              iconBg="bg-purple-100 text-purple-800"
            />
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard
              label="Total Candidates"
              value="3,542"
              change="12.5%"
              icon={Users}
              iconBg="bg-purple-100 text-purple-600"
            />
            <StatCard
              label="Total Emails"
              value="287"
              change="8.2%"
              icon={Mail}
              iconBg="bg-purple-100 text-purple-600"
            />
            <StatCard
              label="Total Calls"
              value="145"
              change="15.3%"
              icon={Phone}
              iconBg="bg-orange-100 text-orange-500"
            />
            <StatCard
              label="Total Roles"
              value="89"
              change="3.8%"
              icon={Briefcase}
              iconBg="bg-pink-100 text-pink-500"
            />
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Daily Calls & Emails</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 25]} />
                <Tooltip
                  contentStyle={{
                    border: "none",
                    borderRadius: "12px",
                    padding: "8px 12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    fontSize: 13,
                    fontWeight: 500
                  }}
                  itemStyle={{ paddingBottom: 4 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
                <Bar dataKey="Calls" fill="#7C3AED" radius={[1, 1, 0, 0]} />
                <Bar dataKey="Emails" fill="#7C3AED" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Candidates by Position</h2>
            <div className="flex items-center justify-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={85}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                      const RADIAN = Math.PI / 180;
                      const r = innerRadius + (outerRadius - innerRadius) * 0.55;
                      const x = cx + r * Math.cos(-midAngle * RADIAN);
                      const y = cy + r * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} style={{ outline: "none", pointerEvents: "none" }}>
                          {`${value}%`}
                        </text>
                      );
                    }}
                    labelLine={false}
                    style={{ outline: "none" }}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} style={{ outline: "none" }} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ border: "none", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 500, padding: "8px 12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pr-2">
                <PieLegend />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Line Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Candidates Addition Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 1500]}
                  ticks={[0, 250, 500, 750, 1000, 1250, 1500]}
                />
                <Tooltip
                  offset={40}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    fontSize: 13,
                    padding: "8px 12px",
                    fontWeight: 500
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7C3AED"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#7C3AED" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* HR Activity */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">HR Activity</h2>
              <button
                onClick={() => navigate("/activity")}
                className="text-xs text-purple-600 font-semibold hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {hrActivities.map((a) => (
                <div key={a.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.role}</p>
                    <p className="text-xs text-gray-400">{a.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-sm border border-purple-600 ${a.color}`}>
                      {a.action}
                    </span>
                    <span className="text-[10px] text-gray-400">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}