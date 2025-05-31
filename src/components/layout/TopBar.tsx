import ThemedText from "../commons/typography/ThemedText";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileDialog } from "../commons/profile/ProfileDialog";
import { Link } from "react-router-dom";

const TopBar = () => {

  return (
    <div className="flex flex-row justify-between items-center py-4 px-6 bg-amber-950 sticky top-0 z-10">
      <ThemedText variant="h1">FET SPACE</ThemedText>
      <div className="flex flex-row items-center gap-3">
        <ProfileDialog />
        <div className="relative">
          <Link to='/notifications'
          >
            <Bell className="h-5 w-5 text-white" />
          </Link>
          <div className="flex justify-center items-center bg-red-500 rounded-full w-4 h-4 absolute top-[-6px] right-[-6px]">
            <ThemedText variant="caption" className="text-white text-[10px]">
              3
            </ThemedText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
