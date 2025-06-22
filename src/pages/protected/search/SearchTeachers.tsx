import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchTeacher, useAddTeacherToCourse } from '@/hooks/api';
import { useAuth } from '@/context/auth';
import ThemedText from '@/components/commons/typography/ThemedText';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Teacher {
  user_id: number;
  name: string;
  email: string;
  phone_number: string | null;
  isTeacher: boolean; // Now required from backend
}

const SearchTeachersPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: teachers = [], isLoading, error } = useSearchTeacher(searchQuery, courseId ? parseInt(courseId) : 0);
  const { mutate: addTeacher, isPending: isAdding } = useAddTeacherToCourse();

  const handleAddTeacher = (teacherId: number) => {
    if (courseId) {
      addTeacher(
        { courseId: parseInt(courseId), teacherId, accessToken: accessToken || '' },
        {
          onSuccess: () => {
            navigate(`/courses/${courseId}/people`);
          },
          onError: (error) => {
            alert(`Error adding teacher: ${error.message || 'Unknown error'}`);
          },
        }
      );
    }
  };

  console.log('Teachers:', teachers); // Debug log

  return (
    <ContentContainer>
      <div className="p-6">
        <ThemedText variant="h2" className="mb-4">Search Teachers</ThemedText>
        <Input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        {isLoading && <ThemedText>Loading...</ThemedText>}
        {error && <ThemedText className="text-red-500">Error: {error.message}</ThemedText>}
        {teachers.length === 0 && searchQuery && (
          <ThemedText>No teachers found.</ThemedText>
        )}
        {teachers.length > 0 && (
          <div className="space-y-2">
            {teachers.map((teacher: Teacher) => (
              <div
                key={teacher.user_id}
                className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => !teacher.isTeacher && handleAddTeacher(teacher.user_id)} // Only trigger if not enrolled
              >
                <div>
                  <ThemedText variant="body">{teacher.name}</ThemedText>
                  <ThemedText variant="caption" className="text-gray-600 dark:text-gray-400">
                    {teacher.email}
                  </ThemedText>
                </div>
                <Button
                  disabled={isAdding || teacher.isTeacher}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering
                    if (!teacher.isTeacher) handleAddTeacher(teacher.user_id);
                  }}
                                    variant='ghost'

                >
                  {teacher.isTeacher ? 'Already Part' : 'Add to Course'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ContentContainer>
  );
};

export default SearchTeachersPage;