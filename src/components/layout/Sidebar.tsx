import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemedText from "../commons/typography/ThemedText";

const Sidebar = () => {
  const location = useLocation();

  // Переиспользуемый компонент для ссылок
  const SidebarLink = ({ to, iconSrc, children }) => {
    const isActive = location.pathname.includes(to);

    return (
      <Link
        to={to}
        className={`flex flex-row justify-start items-center gap-4 py-5 px-5 
          ${
            isActive
              ? "bg-amber-600 text-white font-semibold" // стили для активной ссылки
              : "text-black hover:bg-amber-300"
          }`}
      >
        <img src={iconSrc} alt={`${children} icon`} className="w-6 h-6" />
        <ThemedText>{children}</ThemedText>
      </Link>
    );
  };

  return (
    <div className="w-[245px] max-[250px] min-[240px] bg-amber-400 flex flex-col py-12 gap-8 h-[100vh] overflow-y-auto">
      <div className="w-16 h-16 min-h-16 rounded-full bg-amber-500 self-center"></div>

      {/* links */}
      <div>
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
    </div>
  );
};

export default Sidebar;
