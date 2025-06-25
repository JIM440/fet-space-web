import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api/';
import { MoreVertical, File, FileText, Image } from 'lucide-react';
import { useCourseAnnouncementDetails } from '@/hooks/api/useCourseAnnouncements';
import { useCommentSocket, useCreateComment, useGetComments } from '@/hooks/api/useComments';
import { useGetPollResponses, useRespondToPoll } from '@/hooks/api';

const CourseAnnouncementDetails: React.FC = () => {
  const { courseId, announcementId } = useParams<{ courseId: string; announcementId: string }>();
  const navigate = useNavigate();
  const { data: announcement, isLoading, error } = useCourseAnnouncementDetails(parseInt(announcementId || '0'));
  const { data: comments, isLoading: commentsLoading } = useGetComments('courseAnnouncement', parseInt(announcementId || '0'));
  const { mutate: addComment } = useCreateComment();
  const [newComment, setNewComment] = useState('');
  useCommentSocket(parseInt(announcementId || '0'));

  // Poll-related state and hooks (unchanged from previous implementation)
  const { mutate: respondToPoll } = useRespondToPoll(); // Assuming this is defined elsewhere or can be added
  const { data: pollResponses } = useGetPollResponses(announcement?.poll?.poll_id || 0);
  const queryClient = useQueryClient();
  const [attachmentSizes, setAttachmentSizes] = useState<{ [key: number]: string }>({});
  const [selectedAttachment, setSelectedAttachment] = useState<{ url: string; originalName: string } | null>(null);

  useEffect(() => {
    if (announcement?.attachments) {
      const fetchSizes = async () => {
        const sizes = {};
        for (let i = 0; i < announcement.attachments.length; i++) {
          const attachment = announcement.attachments[i];
          try {
            const response = await fetch(attachment.url, { method: 'HEAD' });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const size = response.headers.get('content-length');
            sizes[i] = size ? `${(parseInt(size) / 1024).toFixed(2)} KB` : 'Size unavailable (server-side fetch required)';
            if (!size && attachment.url.match(/\.(pdf|docx)$/i)) {
              console.warn(`No content-length for ${attachment.url}. Consider backend API for accurate size.`);
            }
          } catch (err) {
            sizes[i] = 'Size unavailable (error fetching)';
            console.error(`Error fetching size for ${attachment.url}:`, err);
          }
        }
        setAttachmentSizes(sizes);
      };
      fetchSizes();
    }
  }, [announcement]);

  if (isLoading) return <p className="text-white p-4">Loading announcement...</p>;
  if (error) return <p className="text-red-500 p-4">{error.message}</p>;
  if (!announcement) return <p className="text-white p-4">Announcement not found.</p>;

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    addComment(
      {
        type: 'courseAnnouncement',
        targetId: parseInt(announcementId || '0'),
        content: newComment,
      },
      {
        onSuccess: () => setNewComment(''),
      }
    );
  };

  const handlePollResponse = (optionId: number) => {
    if (announcement.poll?.poll_id) {
      respondToPoll(
        { pollId: announcement.poll.poll_id, optionId },
        {
          onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['pollResponses', announcement.poll.poll_id] });
            api.get(`/polls/${announcement.poll.poll_id}/responses`).then((res) => {
              queryClient.setQueryData(['pollResponses', announcement.poll.poll_id], res.data);
            });
          },
        }
      );
    }
  };

  // Assume user role and ID are available (e.g., from auth context)
  const isTeacher = true; // Replace with actual role check
  const currentUserId = 1; // Replace with actual user ID from auth

  // Calculate vote counts for each option
  const voteCounts = announcement.poll?.options?.reduce((acc, option) => {
    acc[option.option_id] = pollResponses?.filter((r) => r.poll_option_id === option.option_id).length || 0;
    return acc;
  }, {} as { [key: number]: number });

  const totalVotes = announcement.poll?.options?.reduce((sum, option) => sum + (voteCounts?.[option.option_id] || 0), 0) || 0;

  // Helper to determine icon and type based on file type
  const getFileInfo = (url: string) => {
    if (url.endsWith('.pdf')) return { icon: <FileText className="w-6 h-6 text-red-500" />, type: 'PDF' };
    if (url.endsWith('.doc') || url.endsWith('.docx')) return { icon: <File className="w-6 h-6 text-blue-500" />, type: 'DOCX' };
    if (url.match(/\.(jpeg|jpg|png|gif)$/i)) return { icon: <Image className="w-6 h-6 text-green-500" />, type: 'IMG' };
    if (url.endsWith('.mp4') || url.endsWith('.mov')) return { icon: <File className="w-6 h-6 text-purple-500" />, type: 'VIDEO' };
    return { icon: <File className="w-6 h-6 text-gray-500" />, type: 'UNKNOWN' };
  };

  const closeModal = () => setSelectedAttachment(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <button
          onClick={() => navigate(`/courses/${courseId}/announcements`)}
          className="text-blue-400 hover:underline"
        >
          ← Back to announcements
        </button>
      </div>
      <p className="text-gray-400 mb-4">
        By {announcement.teacher.user.name} on {new Date(announcement.created_at).toLocaleDateString()}
      </p>
      <div className="text-gray-300 mb-6">
        <h2 className="text-xl font-semibold mb-2">{announcement.title}</h2>
        <p>{announcement.content}</p>
      </div>
      {announcement.attachments?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Attachments</h2>
          {announcement.attachments.map((attachment, index) => {
            const fileName = attachment.originalName || attachment.url.split('/').pop()?.split('?')[0] || `file_${index}`;
            const { icon, type } = getFileInfo(attachment.url);
            return (
              <div key={index} className="flex items-center mb-2 p-2 bg-gray-700 rounded cursor-pointer" onClick={() => setSelectedAttachment(attachment)}>
                {icon}
                <div className="ml-3 flex-1">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {fileName} <span className="text-gray-500">({type})</span>
                  </a>
                  <p className="text-xs text-gray-500">Size: {attachmentSizes[index] || 'Loading...'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Viewing Attachments */}
      {selectedAttachment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative bg-gray-800 p-6 rounded-lg max-w-4xl w-full h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-gray-300"
            >
              ×
            </button>
            {selectedAttachment.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
              <img src={selectedAttachment.url} alt={selectedAttachment.originalName} className="max-w-full max-h-full object-contain" />
            ) : selectedAttachment.url.endsWith('.pdf') ? (
              <iframe src={selectedAttachment.url} title="PDF Viewer" className="w-full h-full" />
            ) : (
              <div className="text-white text-center">
                <p>Preview not available for {selectedAttachment.originalName}. Download to view.</p>
                <a href={selectedAttachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Poll Section */}
      {announcement.is_poll && announcement.poll && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Poll: {announcement.poll.type}</h2>
          {announcement.poll.options?.map((option) => {
            const votes = voteCounts?.[option.option_id] || 0;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            const hasVoted = pollResponses?.some((r) => r.user_id === currentUserId && r.poll_option_id === option.option_id);
            return (
              <div key={option.option_id} className="mb-2">
                <label className="flex items-center space-x-2 text-gray-300">
                  {announcement.poll.allow_multiple_answers ? (
                    <input
                      type="checkbox"
                      checked={hasVoted}
                      onChange={() => handlePollResponse(option.option_id)}
                      className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!isTeacher}
                    />
                  ) : (
                    <input
                      type="radio"
                      name="pollOption"
                      checked={hasVoted}
                      onChange={() => handlePollResponse(option.option_id)}
                      className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!isTeacher}
                    />
                  )}
                  <span>{option.content}</span>
                </label>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400">{votes} votes</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Comments ({announcement._count?.comments || 0})
        </h2>
        {commentsLoading && <p className="text-gray-400 mb-4">Loading comments...</p>}
        {!comments?.length && (
          <p className="text-gray-400 mb-4">No comments yet. Be the first to comment!</p>
        )}
        <ul className="space-y-4 mb-4">
          {comments?.map((c) => (
            <li key={c.comment_id} className="bg-gray-700 p-3 rounded">
              <p className="text-white font-semibold">{c.user.name}</p>
              <p className="text-gray-300">{c.content}</p>
            </li>
          ))}
        </ul>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700"
            disabled={!newComment.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseAnnouncementDetails;