import React, { useState } from "react";
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import ThemedText from "@/components/commons/typography/ThemedText";
import AddOptionsDialog from "@/pages/protected/course-details/components/AddOptionsDialog";
import { useTeacherCourses } from "@/hooks/api";
import { useAuth } from "@/context/auth";
import ErrorComponent from "../commons/error/ErrorComponent";
import FullScreenSpinner from "../commons/loader/FullScreenSpinner";
import ContentContainer from "../commons/containers/ContentContainer";

interface CourseProps {
  course_id: number;
  courseCode: string;
  title: string;
  subtitle?: string;
  description?: string;
}

const tabPathMap: { [key: string]: string } = {
  Announcements: "announcements",
  Content: "content",
  Assignments: "assignments",
  People: "people",
  RevisionQuestions: "revision-questions",
};

const pathTabMap = Object.fromEntries(
  Object.entries(tabPathMap).map(([tab, path]) => [path, tab])
);

const CourseDetailsLayout: React.FC = () => {
  const { courseId: id } = useParams<{ courseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useTeacherCourses(accessToken);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Determine active tab from current path
  const pathSegment = location.pathname.split("/")[3]; // e.g., 'announcements' from '/courses/1/announcements'
  const activeTab = pathTabMap[pathSegment] || "Announcements";

  const course = courses?.find(
    (course: CourseProps) => course.course_id === parseInt(id || "")
  );

  const handleTabClick = (tab: string) => {
    const path = tabPathMap[tab];
    navigate(`/courses/${id}/${path}`);
  };

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  if (error || !course) {
    return (
      <ErrorComponent
        message={error?.message || "Failed to load course"}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="">
      <header className="bg-background-main shadow-md p-4">
        <button
          className="flex items-center text-neutral-text-secondary"
          onClick={() => navigate("/courses")}
        >
          <span className="material-icons mr-2">arrow_back</span>
          <ThemedText variant="h4">{course.code}</ThemedText>
        </button>
      </header>
      <div>
        <img
          src="https://via.placeholder.com/400x150"
          alt="Course Banner"
          className="w-full h-40 object-cover bg-background-neutral"
        />
        <button
          onClick={() => setModalVisible(true)}
          className="absolute bottom-6 right-4 bg-primary-base text-white p-3 rounded-full shadow-md h-12"
        >
          <span className="material-icons">add</span>
        </button>
      </div>
      <ContentContainer>
        <div className="md:mt-[-20px] space-y-4">
          <ThemedText variant="h3">
            {course.code + ": " + course.title}
          </ThemedText>
          {course.description && <ThemedText>{course.description}</ThemedText>}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <ThemedText variant="caption">
              Created at: {course.created_at}
            </ThemedText>
            <ThemedText variant="caption">
              {course.studentsCount || 0} Students
            </ThemedText>
          </div>
          <ThemedText>Join code: {course.join_code}</ThemedText>
        </div>
        <div className="flex gap-2 border-b border-neutral-border pt-6 mb-6 overflow-x-auto whitespace-nowrap bg-background-main sticky top-[50px] w-[calc(100vw-40px)]">
          {Object.keys(tabPathMap).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-primary-base text-neutral-text-primary font-bold"
                  : "text-neutral-text-tertiary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Outlet />
      </ContentContainer>
      <AddOptionsDialog
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        courseId={id}
      />
    </div>
  );
};

export default CourseDetailsLayout;
