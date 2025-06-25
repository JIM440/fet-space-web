import { NavLink } from "react-router-dom";
import ThemedText from "../commons/typography/ThemedText";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  // Переиспользуемый компонент для ссылок
  const logout = () => {
  localStorage.clear(); // Clear all local storage
  window.location.href = '/login'; // Redirect to login page
};


  const SidebarLink = ({ to, iconSrc, children }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex flex-row justify-start items-center gap-4 py-5 px-5 ${
            isActive ? "bg-background-neutral" : ""
          }`
        }
        end
        onClick={() => window.innerWidth < 768 && toggleSidebar()} // Close sidebar on link click for mobile
      >
        <img src={iconSrc} alt={`${children} icon`} className="w-6 h-6" />
        <ThemedText>{children}</ThemedText>
      </NavLink>
    );
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-[245px] flex flex-col py-12 gap-8 h-[100vh] overflow-y-auto bg-background-main border-r-1 border-neutral-border transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-[245px]`}
      >
        <button
          className="absolute top-4 right-4 md:hidden"
          onClick={toggleSidebar}
        >
          <X className="h-6 w-6 text-neutral-text-secondary" />
        </button>

        <div className="w-16 h-16 min-h-16 rounded-full bg-background-neutral self-center"></div>

        {/* links */}
        <div>
          <SidebarLink
            to="/announcements"
            iconSrc="../../src/assets/icons/courses.svg"
          >
            Announcements
          </SidebarLink>
          <SidebarLink to="/courses" iconSrc="../../src/assets/icons/courses.svg">
            Courses
          </SidebarLink>
          <SidebarLink
            to="/upcoming-deadlines"
            iconSrc="../../src/assets/icons/upcoming-deadlines.svg"
          >
            Upcoming Deadlines
          </SidebarLink>
          <SidebarLink
            to="/about-fet"
            iconSrc="../../src/assets/icons/about-fet.svg"
          >
            About FET
          </SidebarLink>
          <SidebarLink
            to="/curriculums"
            iconSrc="../../src/assets/icons/curriculums.svg"
          >
            Curriculums
          </SidebarLink>
          <SidebarLink
            to="/help-and-support"
            iconSrc="../../src/assets/icons/help&support.svg"
          >
            Help & Support
          </SidebarLink>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="w-full text-error mt-[auto] py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
      </div>
    </>
  );
};

export default Sidebar;