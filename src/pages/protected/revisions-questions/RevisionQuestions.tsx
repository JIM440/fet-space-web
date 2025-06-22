import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseRevisionQuestions } from '@/hooks/api/courses';
import ThemedText from '@/components/commons/typography/ThemedText';
import FileCard from '@/components/commons/cards/FileCard';

const RevisionQuestions: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: revisionQuestions, isLoading, isError, error } = useGetCourseRevisionQuestions(parseInt(courseId!));

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (isError || !revisionQuestions) {
    return <ThemedText className="text-center py-4">Error: {error?.message || 'Failed to load revision questions'}</ThemedText>;
  }

  return (
    <div>
      <ThemedText variant="h2" className="mb-4">Revision Questions</ThemedText>
      {revisionQuestions.length === 0 ? (
        <ThemedText className="text-center py-4">No revision questions available.</ThemedText>
      ) : (
        revisionQuestions.map((question: any) => (
          <FileCard
            key={question.question_id}
            file={{
              id: question.question_id,
              name: question.url.split('/').pop() || 'Untitled',
              type: question.file_type as 'pdf' | 'docx' | 'img' | 'ppt' | string,
              pages: 0, // Placeholder, adjust if backend provides page count
              size: 'N/A', // Placeholder, adjust if backend provides size
              date: new Date(question.created_at).toLocaleDateString(),
            }}
          />
        ))
      )}
    </div>
  );
};

export default RevisionQuestions;