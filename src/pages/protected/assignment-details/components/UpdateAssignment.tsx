import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAssignmentDetails, useUpdateAssignment } from '@/hooks/api/courses'; // Updated import path
import ThemedText from '@/components/commons/typography/ThemedText';
import { uploadToCloudinary, mimeToFileTypeMap } from '@/utils/cloudinary'; // Adjust import path

interface Attachment {
  url: string;
  file_type: 'pdf' | 'docx' | 'img' | 'ppt' | 'video' | string;
}

const allowedFileTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/*',
  'application/vnd.ms-powerpoint',
  'video/*',
];

const UpdateAssignment = ({ assignmentId, onClose, courseId }: { assignmentId: number; onClose: () => void; courseId: string }) => {
  const { data: assignment } = useGetAssignmentDetails(assignmentId);
  const updateMutation = useUpdateAssignment();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentAttachments, setCurrentAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description || '');
      setDueDate(assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : '');
      setCurrentAttachments(assignment.attachments || []);
    }
  }, [assignment]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const invalidFiles = selectedFiles.filter(file =>
        !allowedFileTypes.some(type =>
          file.type.startsWith(type.split('*')[0]) || file.type === type
        )
      );

      if (invalidFiles.length > 0) {
        setUploadError('Please upload files in PDF, DOCX, Image, PPT, or Video format.');
        setNewFiles([]);
      } else {
        setUploadError(null);
        setNewFiles(selectedFiles);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignmentId) return;

    let newAttachments: Attachment[] = [];
    try {
      // Upload only new files to Cloudinary
      if (newFiles.length > 0) {
        newAttachments = await Promise.all(
          newFiles.map(file => uploadToCloudinary(file, 'assignments'))
        ).then(results => results.map(({ url, file_type }) => ({ url, file_type })));
      }

      const finalAttachments = [...currentAttachments, ...newAttachments];

      updateMutation.mutate(
        {
          assignmentId,
          title,
          description,
          due_date: dueDate || null,
          attachments: finalAttachments,
        },
        {
          onSuccess: () => onClose(),
          onError: (error) => setUploadError(error.message),
        }
      );
    } catch (error) {
      setUploadError('Failed to upload new attachments. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setCurrentAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <ThemedText variant="h2" className="mb-4 text-white">Edit Assignment</ThemedText>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <ThemedText className="text-gray-300">Title</ThemedText>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div>
            <ThemedText className="text-gray-300">Description</ThemedText>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <ThemedText className="text-gray-300">Due Date</ThemedText>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <ThemedText className="text-gray-300">Attachments</ThemedText>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
              accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.ppt,.pptx,.mp4,.avi,.mov"
            />
            {newFiles.length > 0 && (
              <div className="mt-2">
                {newFiles.map((file, index) => (
                  <div key={index} className="text-gray-400">
                    {file.name} ({mimeToFileTypeMap[file.type] || 'unknown'})
                  </div>
                ))}
              </div>
            )}
            {currentAttachments.length > 0 && (
              <div className="mt-2">
                {currentAttachments.map((attach, index) => (
                  <div key={index} className="text-gray-400 flex items-center justify-between">
                    <span>{attach.url.split('/').pop()} ({attach.file_type})</span>
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
            {uploadError && <ThemedText className="text-red-500 mt-2">{uploadError}</ThemedText>}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
        {updateMutation.isError && !uploadError && <ThemedText className="text-red-500 mt-2">{updateMutation.error.message}</ThemedText>}
      </div>
    </div>
  );
};

export default UpdateAssignment;