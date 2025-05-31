import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex-1 h-[100vh] overflow-y-scroll">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
