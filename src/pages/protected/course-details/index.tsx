import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import { useTeacherCourses } from '@/hooks/api';
import { useAuth } from '@/context/auth';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { data: courses, isLoading, error } = useTeacherCourses(accessToken);
  const course = courses?.find((c: any) => c.course_id === Number(courseId));

  if (isLoading) {
    return (
      <ContentContainer>
        <div>Loading...</div>
      </ContentContainer>
    );
  }

  if (error || !course) {
    return (
      <ContentContainer>
        <div>Error: {error?.message || 'Course not found'}</div>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <ThemedText variant="h2">{course.title}</ThemedText>
      <ThemedText variant="body">{course.subtitle}</ThemedText>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(`/courses/${courseId}/announcements`)}
        >
          View Announcements
        </button>
      </div>
    </ContentContainer>
  );
};

export default CourseDetails;