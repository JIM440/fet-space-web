import React, { useState } from 'react';
import { Outlet, useParams, useLocation, useNavigate } from 'react-router-dom';
import ThemedText from '@/components/commons/typography/ThemedText';
import AddOptionsDialog from '@/pages/protected/course-details/components/AddOptionsDialog';
import { useTeacherCourses } from '@/hooks/api';
import { useAuth } from '@/context/auth';
import type RevisionQuestions from '@/pages/protected/revisions-questions/RevisionQuestions';

interface CourseProps {
  course_id: number;
  courseCode: string;
  title: string;
  subtitle?: string;
  description?: string;
}

const tabPathMap: { [key: string]: string } = {
  Announcements: 'announcements',
  Content: 'content',
  Assignments: 'assignments',
  People: 'people',
  RevisionQuestions: 'revision-questions',
};

const pathTabMap = Object.fromEntries(Object.entries(tabPathMap).map(([tab, path]) => [path, tab]));

const CourseDetailsLayout: React.FC = () => {
  const { courseId: id } = useParams<{ courseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { data: courses, isLoading, error } = useTeacherCourses(accessToken);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Determine active tab from current path
  const pathSegment = location.pathname.split('/')[3]; // e.g., 'announcements' from '/courses/1/announcements'
  const activeTab = pathTabMap[pathSegment] || 'Announcements';

  const course = courses?.find((course: CourseProps) => course.course_id === parseInt(id || ''));

  const handleTabClick = (tab: string) => {
    const path = tabPathMap[tab];
    navigate(`/courses/${id}/${path}`);
  };

  if (isLoading) {
    return <ThemedText className="text-center py-4">Loading...</ThemedText>;
  }

  if (error || !course) {
    return <ThemedText className="text-center py-4">Error: {error?.message || 'Course not found'}</ThemedText>;
  }

  return (
    <div>
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <button
          className="flex items-center text-gray-600 dark:text-gray-300"
          onClick={() => navigate('/courses')}
        >
          <span className="material-icons mr-2">arrow_back</span>
          <span className="font-semibold">{course.code}</span>
        </button>
      </header>
      <div className="relative">
        <img
          src="https://via.placeholder.com/400x150"
          alt="Course Banner"
          className="w-full h-40 object-cover bg-gray-200 dark:bg-gray-700"
        />
        <button
          onClick={() => setModalVisible(true)}
          className="absolute bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600"
        >
          <span className="material-icons">add</span>
        </button>
      </div>
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          <ThemedText variant="h3" className="text-gray-900 dark:text-gray-100">
            {course.code + ": " + course.title}
          </ThemedText>
          {course.description && (
            <ThemedText className="text-gray-700 dark:text-gray-300">{course.description}</ThemedText>
          )}
          <div className="flex flex-col sm:flex-row justify-between">
            <ThemedText variant="caption" className="text-gray-600 dark:text-gray-400">
              Created at: {course.created_at}
            </ThemedText>
            <ThemedText variant="caption" className="text-gray-600 dark:text-gray-400">
              {course.studentsCount} Students
            </ThemedText>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-gray-300 dark:border-gray-600 mt-4">
          {Object.keys(tabPathMap).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Outlet />
      </div>
      <AddOptionsDialog
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        courseId={id}
      />
    </div>
  );
};

export default CourseDetailsLayout;