import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
const MainLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">

      <Sidebar />

      <div className="flex flex-col flex-1 h-full overflow-hidden">


        <div className="flex-shrink-0 z-40">
          <Navbar />
        </div>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-3 min-h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;