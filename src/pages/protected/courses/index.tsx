import React from 'react';
import TopCoursesBar from './components/TopCoursesBar';
import CourseList from './components/CourseList';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import { useTeacherCourses } from '@/hooks/api';
import { useAuth } from '@/context/auth';

const Courses = () => {
  const { accessToken } = useAuth();
  const { data: courses, isLoading, error } = useTeacherCourses(accessToken);

  if (isLoading) {
    return (
      <ContentContainer>
        <TopCoursesBar />
        <div>Loading...</div>
      </ContentContainer>
    );
  }

  if (error) {
    return (
      <ContentContainer>
        <TopCoursesBar />
        <div>Error: {error.message || 'Failed to fetch courses'}</div>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <TopCoursesBar />
      <CourseList courses={courses ||null} />
    </ContentContainer>
  );
};

export default Courses;