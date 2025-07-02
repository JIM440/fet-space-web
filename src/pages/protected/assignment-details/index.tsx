import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAssignmentDetails, useDeleteAssignment } from '@/hooks/api/courses'; // Updated import
import ThemedText from '@/components/commons/typography/ThemedText';
import FileCard from '@/components/commons/cards/FileCard';
import UpdateAssignment from './components/UpdateAssignment';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import BackHeader from '@/components/commons/navigation/BackHeader';

interface Attachment {
  url: string;
  file_type: 'pdf' | 'docx' | 'img' | 'ppt' | 'video' | string;
}

interface Submission {
  studentId: number;
  studentName: string;
  submittedAt: string;
  comment: string;
  attachments: Attachment[];
  status: string;
  statusColor: string;
}

interface AssignmentDetails {
  assignment_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
  attachments: Attachment[];
  totalSubmissions: number;
  submissions: Submission[];
}

const AssignmentDetails = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { data: assignment, isLoading, error } = useGetAssignmentDetails(parseInt(assignmentId!));
  const deleteMutation = useDeleteAssignment(parseInt(assignmentId!), parseInt(courseId!));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteMutation.mutateAsync();
        navigate(`/courses/${courseId}/assignments`);
      } catch (err) {
        console.error('Delete failed:', err);
        // Optionally set an error state to display to the user
      }
    }
  };

  if (isLoading) return <div className="text-center py-4 text-black">Loading...</div>;
  if (error || !assignment) return <ThemedText className="text-center py-4 text-error">Error: {error?.message || 'Assignment not found'}</ThemedText>;

  return (
    <ContentContainer>
      <BackHeader title='' />
      <div className="flex justify-between items-center mb-4">
        <ThemedText variant="h2" className="text-black">{assignment.title}</ThemedText>
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-neutral-text-secondary mr-2"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-error"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <ThemedText className="mb-4 text-neutral-text-secondary">{assignment.description || 'No description provided'}</ThemedText>
      <ThemedText variant="caption" className="mb-4 text-gray-400">
        Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}
      </ThemedText>
      <ThemedText variant="h4" className="mb-2 text-neutral-text-secondary">Attachments</ThemedText>
      {assignment.attachments && assignment.attachments.length > 0 ? (
        assignment.attachments.map((attach, index) => (
          <div key={index} className="mb-2" data-content-id={assignment.assignment_id} data-url={attach.url}>
            <FileCard
              file={{
                id: assignment.assignment_id,
                name: attach.url.split('/').pop() || `Attachment ${index + 1}`,
                type: attach.file_type || 'unknown',
                pages: 0,
                size: 'Loading...', // Fetch size if needed
                date: new Date(assignment.created_at).toLocaleDateString(),
              }}
            />
          </div>
        ))
      ) : (
        <ThemedText className="text-neutral-text-secondary">No attachments available</ThemedText>
      )}
      <ThemedText variant="h4" className="mt-4 mb-2 text-neutral-text-secondary">Submissions</ThemedText>
      <ThemedText variant="caption" className="mb-2 text-neutral-text-tertiary">Total Submissions: {assignment.totalSubmissions}</ThemedText>
      {assignment.submissions && assignment.submissions.length > 0 ? (
        assignment.submissions.map((submission, index) => (
          <div key={index} className="my-4 p-2">
            <div className='flex gap-2'><img src="" alt="" className='bg-background-neutral w-10 h-10 rounded-full' />
            <div>
              <ThemedText className="text-neutral-text-secondary"> {submission.studentName}</ThemedText>
              <ThemedText className="text-neutral-text-secondary"> {submission.studentMatricule}</ThemedText>
            </div>
            </div>
            <ThemedText variant="caption" className={`text-${submission.statusColor}-500`}>
              {submission.status} - {new Date(submission.submittedAt).toLocaleDateString()} {new Date(submission.submittedAt).toLocaleTimeString()}
            </ThemedText>
            {/* <ThemedText className="text-neutral-text-secondary">Comment: {submission.comment}</ThemedText> */}
            {submission.attachments.length > 0 && (
              <div className="mt-2">
                <ThemedText>Attachments</ThemedText>
                {submission.attachments.map((attach, idx) => (
                  <div key={idx} className="mb-2" data-url={attach.url}>
                    <FileCard
                      file={{
                        id: assignment.assignment_id,
                        name: attach.url.split('/').pop() || `Attachment ${idx + 1}`,
                        type: attach.file_type || 'unknown',
                        pages: 0,
                        size: 'Loading...',
                        date: new Date(submission.submittedAt).toLocaleDateString(),
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <ThemedText className="text-gray-400">No submissions yet</ThemedText>
      )}
      {isModalOpen && (
        <UpdateAssignment
          assignmentId={assignment.assignment_id}
          onClose={() => setIsModalOpen(false)}
          courseId={courseId}
        />
      )}
    </ContentContainer>
  );
};

export default AssignmentDetails;