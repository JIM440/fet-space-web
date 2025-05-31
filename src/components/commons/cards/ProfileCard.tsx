import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemedText from '@/components/commons/typography/ThemedText';

interface UserProps {
  id: number;
  name: string;
  matricule?: string;
  imageUri: string;
}

const ProfileCard: React.FC<{ user: UserProps; type: 'student' | 'teacher' }> = ({ user, type }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/user/${user.id}`)}
      className="flex items-center py-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
    >
      <img
        src={user.imageUri}
        alt={user.name}
        className="w-10 h-10 rounded-full mr-2 bg-gray-200 dark:bg-gray-700"
      />
      <div>
        <ThemedText variant="h4" className="text-gray-900 dark:text-gray-100">
          {user.name}
        </ThemedText>
        {type === 'student' && (
          <ThemedText className="text-gray-500 dark:text-gray-400">
            {user.matricule}
          </ThemedText>
        )}
      </div>
    </button>
  );
};

export default ProfileCard;