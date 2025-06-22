// pages/protected/course-details/assignments/Assignments.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseAssignments } from '@/hooks/api/courses';
import ThemedText from '@/components/commons/typography/ThemedText';
import AssignmentCard from '@/components/commons/cards/AssignmentCard'; // Assuming this exists

const Assignments = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: assignments, isLoading, isError, error } = useGetCourseAssignments(parseInt(courseId));

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (isError || !assignments) {
    return <ThemedText className="text-center py-4">Error: {error?.message || 'Failed to load assignments'}</ThemedText>;
  }

  return (
    <div>
      {assignments.map((assignment: any) => (
        <AssignmentCard key={assignment.assignment_id} assignment={assignment} />
      ))}
    </div>
  );
};

export default Assignments;