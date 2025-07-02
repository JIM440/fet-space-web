import React from "react";
import { useNavigate } from "react-router-dom";
import ThemedText from "@/components/commons/typography/ThemedText";
import { getTimeAgo } from "@/utils/dateFormatter";

interface NotificationProps {
  id: string;
  image: string;
  type: string;
  code: string;
  time: string;
  description: string;
  read: boolean;
  assignmentId?: string;
}

const NotificationsItem: React.FC<{
  notification: NotificationProps;
  index?: number;
}> = ({ notification, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-row p-4 ${
        !notification.read ? "bg-background-light" : ""
      } mb-0.25`}
      onClick={() => {
        if (
          notification.type === "New Assignment" &&
          notification.assignmentId
        ) {
          navigate(`/assignment/${notification.assignmentId}`);
        }
      }}
    >
      <img
        src={
          index % 2 === 0
            ? "https://static.studyin-uk.com/assets/study-guide/uk-university-course-search.jpg"
            : "https://www.archcareersguide.com/wp-content/uploads/2018/09/coursework-300x300.jpg"
        }
        alt={`${notification.type} icon`}
        className="w-10 h-10 rounded-full bg-background-neutral text-[10px] object-cover"
      />
      <div className="flex-1 ml-3">
        <div className="flex justify-between">
          <ThemedText
            variant="h4"
            numberOfLines={1}
            className="max-w-[95%] text-neutral-text-primary"
          >
            {notification.type} posted in {notification.code}
          </ThemedText>
          <ThemedText variant="caption">{getTimeAgo(notification.time)}</ThemedText>
        </div>
        <ThemedText variant="caption" numberOfLines={1} className="max-w-[95%]">
          {notification.description}
        </ThemedText>
      </div>
    </div>
  );
};

export default NotificationsItem;
