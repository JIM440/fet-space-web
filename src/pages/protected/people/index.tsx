// pages/protected/course-details/people/People.tsx
import { useParams } from 'react-router-dom';
import { useGetCoursePersons } from '@/hooks/api/courses';
import ThemedText from '@/components/commons/typography/ThemedText';
import ProfileCard from '@/components/commons/cards/ProfileCard';
import InlineSpinner from '@/components/commons/loader/InlineSpinner';
import ErrorComponent from '@/components/commons/error/ErrorComponent';

const People = () => {
  const { courseId } = useParams<{ courseId: string }>(); // match the dynamic segment in your route, e.g., /courses/:id/people
  const course_id = parseInt(courseId || '', 10);
  const { data: persons, isLoading, isError, error, refetch } = useGetCoursePersons(course_id);

  if (isNaN(course_id)) {
    return <ThemedText className="text-center py-4">Invalid course ID</ThemedText>;
  }

  if (isLoading) {
    return <InlineSpinner />
  }

  if (isError || !persons) {
   return <ErrorComponent message={`Error: ${error?.message || 'Failed to load people'}`} onRetry={refetch} />
  }

  return (
    <div>
      <ThemedText variant="h3">Teachers</ThemedText>
      {persons.teachers.map((teacher: any, index) => (
        <ProfileCard key={teacher.id} user={teacher} type="teacher" index={index} />
      ))}
      <div className='mb-8' />
      {persons.students.length > 0 && <ThemedText variant="h3" className="mt-4">Students ({persons.students.length})</ThemedText>}
      {persons.students.map((student: any, index) => (
        <ProfileCard key={student.id} user={student} type="student" index={index} />
      ))}
      {persons.students.length === 0 && <>
      <ThemedText className='text-center mb-4'>No students have been added yet.</ThemedText>
      <ThemedText className='text-center mb-4'>Click the button (+) below to add students or share the join code with them.</ThemedText>
      </>}
    </div>
  );
};

export default People;
