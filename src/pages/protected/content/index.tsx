import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseContents } from '@/hooks/api/courses';
import ThemedText from '@/components/commons/typography/ThemedText';
import FileCard from '@/components/commons/cards/FileCard';

const CourseContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: contents, isLoading, isError, error } = useGetCourseContents(parseInt(courseId!));

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (isError || !contents) {
    return <ThemedText className="text-center py-4">Error: {error?.message || 'Failed to load contents'}</ThemedText>;
  }

  return (
    <div>
      <ThemedText variant="h2" className="mb-4">Course Contents</ThemedText>
      {contents.length === 0 ? (
        <ThemedText className="text-center py-4">No contents available.</ThemedText>
      ) : (
        contents.map((content: any) => (
          <FileCard
            key={content.content_id}
            file={{
              id: content.content_id,
              name: content.url.split('/').pop() || 'Untitled',
              type: content.file_type as 'pdf' | 'docx' | 'img' | 'ppt' | string,
              pages: 0, // Placeholder, adjust if backend provides page count
              size: 'N/A', // Placeholder, adjust if backend provides size
              date: new Date(content.created_at).toLocaleDateString(),
            }}
          />
        ))
      )}
    </div>
  );
};

export default CourseContent;