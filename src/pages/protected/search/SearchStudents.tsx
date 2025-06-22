import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearchStudent, useAddStudentToCourse } from '@/hooks/api';
import ThemedText from '@/components/commons/typography/ThemedText';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Student {
  user_id: number;
  name: string;
  email: string;
  matricule_number: string | null;
  isEnrolled: boolean; // Now required from backend
}

const SearchStudentsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: students = [], isLoading, error } = useSearchStudent(searchQuery, courseId ? parseInt(courseId) : 0);
  const { mutate: addStudent, isPending: isAdding } = useAddStudentToCourse();

  const handleAddStudent = (studentId: number) => {
    if (courseId) {
      addStudent(
        { courseId: parseInt(courseId), studentId },
        {
          onSuccess: () => {
            navigate(`/courses/${courseId}/people`);
          },
          onError: (error) => {
            alert(`Error adding student: ${error.message || 'Unknown error'}`);
          },
        }
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || '';
    setSearchQuery(value);
  };

  return (
    <ContentContainer>
      <div className="p-6">
        <ThemedText variant="h2" className="mb-4">Search Students</ThemedText>
        <Input
          type="text"
          placeholder="Search by name or matricule"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4"
        />
        {isLoading && <ThemedText>Loading...</ThemedText>}
        {error && <ThemedText className="text-red-500">Error: {error.message}</ThemedText>}
        {students.length === 0 && searchQuery && (
          <ThemedText>No students found.</ThemedText>
        )}
        {students.length > 0 && (
          <div className="space-y-2">
            {students.map((student: Student) => (
              <div
                key={student.user_id}
                className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded shadow hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => !student.isEnrolled && handleAddStudent(student.user_id)} // Only trigger if not enrolled
              >
                <div>
                  <ThemedText variant="body">{student.name}</ThemedText>
                  <ThemedText variant="caption" className="text-gray-600 dark:text-gray-400">
                    {student.matricule_number || student.email}
                  </ThemedText>
                </div>
                <Button
                  disabled={isAdding || student.isEnrolled}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering
                    if (!student.isEnrolled) handleAddStudent(student.user_id);
                  }}
                  variant='ghost'
                >
                  {student.isEnrolled ? 'Already Part' : 'Add to Course'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ContentContainer>
  );
};

export default SearchStudentsPage;
