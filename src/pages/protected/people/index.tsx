// pages/protected/course-details/people/People.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCoursePersons } from '@/hooks/api/courses';
import ThemedText from '@/components/commons/typography/ThemedText';
import ProfileCard from '@/components/commons/cards/ProfileCard';

const People = () => {
  const { courseId } = useParams<{ courseId: string }>(); // match the dynamic segment in your route, e.g., /courses/:id/people
  console.log(courseId)
  const course_id = parseInt(courseId || '', 10);
  const { data: persons, isLoading, isError, error } = useGetCoursePersons(course_id);

  if (isNaN(course_id)) {
    return <ThemedText className="text-center py-4">Invalid course ID</ThemedText>;
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (isError || !persons) {
    return <ThemedText className="text-center py-4">Error: {error?.message || 'Failed to load people'}</ThemedText>;
  }

  return (
    <div>
      <ThemedText variant="h3">Teachers</ThemedText>
      {persons.teachers.map((teacher: any) => (
        <ProfileCard key={teacher.id} user={teacher} type="teacher" />
      ))}
      <ThemedText variant="h3" className="mt-4">Students</ThemedText>
      {persons.students.map((student: any) => (
        <ProfileCard key={student.id} user={student} type="student" />
      ))}
    </div>
  );
};

export default People;
