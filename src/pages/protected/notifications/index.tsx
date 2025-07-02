import React from 'react';
import NotificationsItem from './components/NotificationsItems';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import { useGetNotifications } from "@/hooks/api/notifications";
import FullScreenSpinner from '@/components/commons/loader/FullScreenSpinner';
import ErrorComponent from '@/components/commons/error/ErrorComponent';


const mockNotifications = [
  { id: "6", image: "https://example.com/notification_icon.png", type: "General Announcement", time: "10min", description: "Remember to bring all supplies for Chemistry class tomorrow.", read: false, code: "Math 101" },
  { id: "3", image: "https://example.com/teacher_profile.jpg", type: "New Assignment", time: "4h", description: "History 301 - Essay on the French Revolution assigned by Professor Davis.", read: false, code: "His 301" },
  { id: "7", image: "https://example.com/profile_pic_1.jpg", type: "New Assignment", time: "5h", description: "Coding 101 - Assignment Set 3 due next week.", read: false, code: "Cod 101" },
  { id: "9", image: "https://example.com/teacher_profile.jpg", type: "New Assignment", time: "6h", description: "Algebra 301 - Worksheet on Trigonometry assigned by Professor Lewis.", read: false, code: "Alg 101" },
  { id: "4", image: "https://example.com/profile_pic_2.jpg", type: "New Assignment", time: "1d", description: "Science 201 - Lab Report #2 is due on Friday.", read: true, code: "Sci 101" },
  { id: "1", image: "https://example.com/profile_pic_1.jpg", type: "New Assignment", time: "3d", description: "Math 101 - Problem Set 3 due next week.", read: false, code: "Math 101" },
  { id: "5", image: "https://example.com/notification_icon.png", type: "General Announcement", time: "1w", description: "School closed on Monday for holiday", read: true, code: "Math 101" },
];

const Notifications: React.FC = () => {
    const { data: notifications, isLoading, isError, error, refetch } =
    useGetNotifications();

    
  if (isLoading) {
    return <ContentContainer>
      <FullScreenSpinner />
    </ContentContainer>;
  }

  if (isError || !notifications) {
    return (
      <ContentContainer>
    
        <ErrorComponent  message={`        Error: ${error?.message || "Failed to load notifications"}
    `} onRetry={refetch} />
      </ContentContainer>
    );
  }
  return (
    <ContentContainer>
        <div>
          {notifications.map((notification, index) => (
            <NotificationsItem key={notification.id} notification={notification} index={index} />
          ))}
        </div>
    </ContentContainer>
  );
};

export default Notifications;