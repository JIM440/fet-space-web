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
  index,
}) => {

  return (
    <div
      className={`flex flex-row p-4 ${!notification.read ? 'bg-gray-50 dark:bg-gray-800' : ''} border-t ${index === 0 ? 'border-t-0' : 'border-gray-200 dark:border-gray-700'}`}
    >
      <img
        src={notification.image}
        alt={`${notification.type} icon`}
        className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
      />
      <div className="flex-1 ml-3">
        <div className="flex justify-between">
          <ThemedText variant="body" 
          numberOfLines={1} className="max-w-[95%]">
            {notification.type} posted in {notification.code}</ThemedText>
          <ThemedText variant="caption">{notification.time}</ThemedText>
        </div>
        <ThemedText
          variant="caption"
          numberOfLines={1}
          className="text-gray-500 dark:text-gray-400 max-w-[95%]"
        >
          {notification.description}
        </ThemedText>
      </div>
    </div>
  );
};

export default NotificationsItem;