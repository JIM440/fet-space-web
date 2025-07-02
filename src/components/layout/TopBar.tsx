import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {api} from "@/utils/api";
import ThemedText from "../commons/typography/ThemedText";
import { ProfileDialog } from "../commons/profile/ProfileDialog";

interface Notification {
  id: string;
  image: string;
  type: string;
  code: string;
  time: string;
  description: string;
  read: boolean;
  assignmentId?: string;
}

interface TopBarProps {
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  // Fetch notifications
  const { data: notifications = [] } = useQuery<Notification[], Error>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-row justify-between items-center py-4 px-6 sticky top-0 z-10 border-b-1 border-neutral-border bg-background-main">
      <div className="flex items-center gap-4">
        <button className="md:hidden" onClick={toggleSidebar}>
          <Menu className="h-6 w-6 text-neutral-text-secondary" />
        </button>
        <ThemedText variant="h1" className="hidden md:block"></ThemedText>
      </div>
      <div className="flex flex-row items-center gap-3">
        <ProfileDialog />
        <div className="relative">
          <Link to="/notifications">
            <Bell className="h-5 w-5 text-neutral-text-secondary" />
          </Link>
          {unreadCount > 0 && (
            <div className="flex justify-center items-center bg-error rounded-full w-4 h-4 absolute top-[-6px] right-[-6px]">
              <ThemedText variant="caption" className="text-white text-[10px]">
                {unreadCount}
              </ThemedText>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;