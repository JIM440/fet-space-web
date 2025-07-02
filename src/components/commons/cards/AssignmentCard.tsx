import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ThemedText from '@/components/commons/typography/ThemedText';

interface AssignmentProps {
  id: number;
  title: string;
  description: string;
  date: string;
}

const AssignmentCard: React.FC<{ assignment: AssignmentProps }> = ({ assignment }) => {
  const navigate = useNavigate();
  const {courseId} = useParams()

  return (
    <button
      onClick={() => navigate(`/courses/${courseId}/assignments/${assignment.id}/`)} // Updated navigation
      className="w-full p-4 mb-2 border border-neutral-border"
    >
      <div className="flex justify-between items-start">
        <div className="max-w-[80%]">
          <ThemedText variant="h4" className='text-left'>
            {assignment.title}
          </ThemedText>
          <ThemedText variant="caption" className="line-clamp-2 text-left">
            {assignment.description}
          </ThemedText>
        </div>
        <ThemedText variant="caption" className="text-left">
          Due: {assignment.date}
        </ThemedText>
      </div>
    </button>
  );
};

export default AssignmentCard;