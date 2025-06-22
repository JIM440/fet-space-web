// pages/protected/course-details/assignments/AssignmentDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseAssignments } from '@/hooks/api/courses';
import ThemedText from '@/components/commons/typography/ThemedText';

const AssignmentDetails = () => {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const { data: assignments, isLoading, error } = useGetCourseAssignments(parseInt(courseId || ''));

  if (isLoading) return <div>Loading...</div>;
  if (error || !assignments) return <div>Error: {error?.message || 'Assignment not found'}</div>;

  const assignment = assignments.find((a: any) => a.assignment_id === parseInt(assignmentId || ''));

  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div>
      <ThemedText variant="h2">{assignment.title}</ThemedText>
      <ThemedText>{assignment.description}</ThemedText>
      {/* Add more details as needed */}
    </div>
  );
};

export default AssignmentDetails;