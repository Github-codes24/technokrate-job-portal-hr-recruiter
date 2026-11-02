import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "New Roles Added",
    message: "2 new roles added.",
    details: "The new roles added are Senior Frontend Developer and Backend Engineer. They have been posted in the IT department.",
    time: "Today 6:30 AM",
    bg: "bg-green-50",
    isRead: false,
  },
  {
    id: 2,
    title: "Mail Received",
    message: "1 new mail received .",
    details: "You received an email from John Doe regarding the recent candidate interview feedback.",
    time: "Today 6:30 AM",
    bg: "bg-red-50",
    isRead: false,
  },
  {
    id: 3,
    title: "New Database Added",
    message: "1 new database added",
    details: "The new MongoDB cluster has been successfully provisioned and linked to the Jobseeker portal.",
    time: "Today 6:30 AM",
    bg: "bg-green-50",
    isRead: true,
  },
  {
    id: 4,
    title: "Calls Received",
    message: "4 new calls received .",
    details: "Missed calls from 4 different candidates inquiring about their application status.",
    time: "Today 6:30 AM",
    bg: "bg-red-50",
    isRead: true,
  },
];

const Notification = () => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("userNotifications");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to load notifications from local storage", e);
    }
    return initialNotifications;
  });
  
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
    window.dispatchEvent(new Event("notificationsUpdate"));
  }, [notifications]);

  const toggleReadStatus = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 w-full mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <button
            onClick={markAllAsRead}
            className="text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors"
          >
            Mark all as read
          </button>
        </div>
        <hr className="border-gray-200 mb-6" />

        <div className="flex flex-col gap-4">
          {notifications.map((n) => {
             const isExpanded = expandedId === n.id;
             return (
              <div
                key={n.id}
                onClick={() => toggleExpand(n.id)}
                className={`relative rounded-xl px-6 py-5 flex flex-col gap-2 cursor-pointer transition-all duration-200 border ${
                  n.isRead ? "bg-white border-gray-200 shadow-sm opacity-70 hover:opacity-100" : `${n.bg} border-transparent shadow-md`
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={(e) => toggleReadStatus(n.id, e)}
                      className={`mt-0.5 focus:outline-none transition-colors ${n.isRead ? "text-gray-400 hover:text-gray-600" : "text-purple-600 hover:text-purple-800"}`}
                      title={n.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {n.isRead ? <CheckCircle2 size={22} /> : <Circle size={22} className="fill-purple-100" />}
                    </button>
                    <div>
                      <p className={`text-base font-bold ${n.isRead ? "text-gray-600" : "text-gray-900"}`}>
                        {n.title}
                      </p>
                      <p className={`text-sm mt-1 ${n.isRead ? "text-gray-500" : "text-gray-800"}`}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <span className="hidden sm:inline">{isExpanded ? "Show Less" : "Read More"}</span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                
                {/* Expanded Details Section */}
                <div 
                  className={`pl-10 pr-4 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-sm text-gray-600 bg-white/60 p-4 rounded-lg border border-gray-100 leading-relaxed shadow-inner">
                    {n.details}
                  </p>
                </div>
                
                <p className="text-xs text-gray-400 text-right mt-1 font-medium">{n.time}</p>
              </div>
            );
          })}
          
          {notifications.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-medium">
              You have no notifications.
            </div>
          )}
        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 py-4">
        @ 2024 MyJob – Job Portal. All rights Rserved
      </footer>
    </div>
  );
};

export default Notification;