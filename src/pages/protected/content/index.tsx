import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseContents, useDeleteCourseContent } from '@/hooks/api/courses';
import ThemedText from '@/components/commons/typography/ThemedText';
import FileCard from '@/components/commons/cards/FileCard';
import InlineSpinner from '@/components/commons/loader/InlineSpinner';
import ErrorComponent from '@/components/commons/error/ErrorComponent';

interface Attachment {
  url: string;
  file_type: 'pdf' | 'docx' | 'img' | 'ppt' | 'video' | string;
}

interface CourseContent {
  content_id: number;
  attachments: Attachment[] | null;
  created_at: string;
}

const CourseContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: contents, isLoading, isError, error, refetch} = useGetCourseContents(parseInt(courseId!));
  const [attachmentSizes, setAttachmentSizes] = useState<{ [key: number]: string }>({});
  const deleteMutation = useDeleteCourseContent();

  useEffect(() => {
    if (contents && contents.length > 0) {
      const fetchSizes = async () => {
        const sizes: { [key: number]: string } = {};
        for (let i = 0; i < contents.length; i++) {
          const attachment = contents[i].attachments?.[0];
          if (attachment?.url) {
            try {
              const response = await fetch(attachment.url, { method: 'HEAD' });
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const size = response.headers.get('content-length');
              sizes[contents[i].content_id] = size ? `${(parseInt(size) / 1024).toFixed(2)} KB` : 'Size unavailable';
            } catch (err) {
              sizes[contents[i].content_id] = 'Size unavailable';
              console.error(`Error fetching size for ${attachment.url}:`, err);
            }
          } else {
            sizes[contents[i].content_id] = 'No attachment';
          }
        }
        setAttachmentSizes(sizes);
      };
      fetchSizes();
    }
  }, [contents]);
  
  const handleDelete = (contentId: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      deleteMutation.mutate({ courseId: parseInt(courseId!), contentId });
    }
  };

  if (isLoading) {
    return <InlineSpinner />
  }

  if (isError) {
    return <ErrorComponent message={`Error: ${error?.message || 'Failed to load course contents'}`} onRetry={refetch} />
  }
  

  return (
    <div className="p-4">
      {contents.length === 0 ? (
        <>
        <ThemedText className="text-center py-4">No contents available.</ThemedText>
        <ThemedText className="text-center">Click the button (+) below to upload course contents.</ThemedText>
        </>
      ) : (
        contents.map((content: CourseContent) => {
          const attachment = content.attachments?.[0];
          return (
            <div key={content.content_id} className="flex items-center mb-2" data-content-id={content.content_id} data-url={attachment?.url || ''}>
              <FileCard
                file={{
                  id: content.content_id,
                  name: attachment?.url.split('/').pop() || 'Untitled',
                  type: attachment?.file_type || 'unknown',
                  pages: 0,
                  size: attachmentSizes[content.content_id] || 'Loading...',
                  date: new Date(content.created_at).toLocaleDateString(),
                }}
              />
              <button
                onClick={() => handleDelete(content.content_id)}
                className="ml-2 text-error"
                aria-label="Delete content"
              >
                ×
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CourseContent;