import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import { useNavigate } from 'react-router-dom';
import { useGetUpcomingDeadlines } from '@/hooks/api/courses';
import React from 'react';
import CardsSkeleton from '@/components/commons/loader/CardsSkeleton';
import ErrorComponent from '@/components/commons/error/ErrorComponent';
import DeadlineCard from './components/DeadlineCard';

import type { Assignment } from '@/types'; // Adjust the import path as necessary

const UpcomingDeadlines: React.FC = () => {
  // const { role } = useAuth<{ role: string }>();
  const role = 'teacher';
  const navigate = useNavigate();
  const { data: deadlines, isLoading, isError, error, refetch } = useGetUpcomingDeadlines(role);

  const handleViewDetails = (assignmentId: number, courseId: number) => {
    navigate(`/courses/${courseId}/assignments/${assignmentId}/`);
  };

  if (isLoading) {
    return (
<CardsSkeleton />
    );
  }

  if (isError) {
    return (
        <ErrorComponent message={error?.message} onRetry={refetch} />
    );
  }

  return (
    <ContentContainer>
      <div className="space-y-4">
        {deadlines?.length > 0 ? (
          deadlines.map((assignment: Assignment) => (
            <DeadlineCard
              key={assignment.assignment_id}
              assignment={assignment}
              onClick={handleViewDetails}
            />
          ))
        ) : (
          <ThemedText className="text-gray-400 text-center py-4">
            No upcoming deadlines.
          </ThemedText>
        )}
      </div>
    </ContentContainer>
  );
};

export default UpcomingDeadlines;