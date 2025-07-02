import React from "react";
import TopCoursesBar from "./components/TopCoursesBar";
import CourseList from "./components/CourseList";
import ContentContainer from "@/components/commons/containers/ContentContainer";
import { useTeacherCourses } from "@/hooks/api";
import { useAuth } from "@/context/auth";
import ErrorComponent from "@/components/commons/error/ErrorComponent";
import CardsSkeleton from "@/components/commons/loader/CardsSkeleton";

const Courses = () => {
  const { accessToken } = useAuth();
  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useTeacherCourses(accessToken);

  if (isLoading) {
    return (
      <ContentContainer>
        <TopCoursesBar />
        <CardsSkeleton />
      </ContentContainer>
    );
  }

  if (error) {
    return (
      <>
        <TopCoursesBar />
        <ErrorComponent
          message={`Error: ${error.message || "Failed to fetch courses"}`}
          onRetry={refetch}
        />
      </>
    );
  }

  return (
    <ContentContainer>
      <TopCoursesBar />
      <CourseList courses={courses || null} />
    </ContentContainer>
  );
};

export default Courses;
