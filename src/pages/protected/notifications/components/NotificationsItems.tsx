import React from 'react';
import ThemedText from '@/components/commons/typography/ThemedText';

interface NotificationProps {
  id: string;
  image: string;
  type: string;
  code: string;
  time: string;
  description?: string;
  read: boolean;
}

const NotificationsItem: React.FC<{ notification: NotificationProps; index?: number }> = ({
  notification,
}) => {

  return (
    <div
      className={`flex flex-row p-4 ${!notification.read ? 'bg-background-light' : ''} mb-0.25`}
    >
      <img
        src={notification.image}
        alt={`${notification.type} icon`}
        className="w-10 h-10 rounded-full bg-background-neutral text-[10px]"
      />
      <div className="flex-1 ml-3">
        <div className="flex justify-between">
          <ThemedText variant="h4" 
          numberOfLines={1} className="max-w-[95%] text-neutral-text-primary">
            {notification.type} posted in {notification.code}</ThemedText>
          <ThemedText variant="caption">{notification.time}</ThemedText>
        </div>
        <ThemedText
          variant="caption"
          numberOfLines={1}
          className="max-w-[95%]"
        >
          {notification.description}
        </ThemedText>
      </div>
    </div>
  );
};

export default NotificationsItem;