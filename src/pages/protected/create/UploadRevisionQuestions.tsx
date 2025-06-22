import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import { Button } from '@/components/ui/button';
import { useUploadCourseContent } from '@/hooks/api/courses';

const UploadCourseContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { mutate: uploadContent, isPending: isLoading, error } = useUploadCourseContent();
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]; // Take only the first file
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
    }
  };

  const handleUpload = () => {
    if (!file || !courseId) return;
    uploadContent({ courseId: parseInt(courseId), file });
  };

  return (
    <ContentContainer>
      <ThemedText variant="h2">Upload Course Content</ThemedText>
      {error && <ThemedText variant="body" className="text-red-500 mb-4">{error.message}</ThemedText>}
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white cursor-pointer text-center">
          {selectedFileName || 'Select File'}
        </label>
      </div>
      <Button
        onClick={handleUpload}
        disabled={isLoading || !file}
        className="mt-4 w-full"
        variant="destructive"
      >
        {isLoading ? 'Uploading...' : 'Upload File'}
      </Button>
    </ContentContainer>
  );
};

export default UploadCourseContent;