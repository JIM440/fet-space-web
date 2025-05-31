import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemedText from '@/components/commons/typography/ThemedText';

interface AssignmentProps {
  id: number;
  title: string;
  description: string;
  date: string;
}

const AssignmentCard: React.FC<{ assignment: AssignmentProps }> = ({ assignment }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/assignment/${assignment.id}`)}
      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <div className="flex justify-between items-start">
        <div className="max-w-[80%]">
          <ThemedText variant="h4" className="line-clamp-1 text-gray-900 dark:text-gray-100">
            {assignment.title}
          </ThemedText>
          <ThemedText variant="caption" className="line-clamp-1 text-gray-500 dark:text-gray-400">
            {assignment.description}
          </ThemedText>
        </div>
        <ThemedText variant="caption" className="text-gray-500 dark:text-gray-400">
          {assignment.date}
        </ThemedText>
      </div>
    </button>
  );
};

export default AssignmentCard;