import React, { useEffect, useState, Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import { Button } from '@/components/ui/button';
import { File, FileText, Image } from 'lucide-react';
import io from 'socket.io-client';
import { 
  useGeneralAnnouncements, 
  useComments, 
  useCreateComment, 
  usePollResponses, 
  useRespondToPoll 
} from '@/hooks/api';
import { useAuth } from '@/context/auth';
import { useQueryClient } from '@tanstack/react-query';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500 bg-gray-800 rounded">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface PollOption {
  option_id: number;
  content: string;
}

interface Poll {
  poll_id: number;
  type: string;
  allow_multiple_answers: boolean;
  options: PollOption[];
}

interface Attachment {
  url: string;
  originalName?: string;
}

interface Announcement {
  announcement_id: number;
  title: string;
  content: string;
  created_at: string;
  is_poll: boolean;
  poll?: Poll;
  attachments: Attachment[];
  admin: {
    user_id: number;
    user: { name: string; role: string };
  };
  _count?: { comments: number };
}

const AnnouncementDetails: React.FC = () => {
  const { announcementId } = useParams<{ announcementId: string }>();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const queryClient = useQueryClient();
  const { data: announcements, isLoading, error } = useGeneralAnnouncements(accessToken);
  const announcement = announcements?.find((a: Announcement) => a.announcement_id === Number(announcementId));
  const { data: comments, isLoading: commentsLoading, refetch: refetchComments } = useComments(accessToken, 'generalAnnouncement', Number(announcementId));
  const { mutate: createComment } = useCreateComment();
  const { data: pollResponses, refetch: refetchPollResponses } = usePollResponses(accessToken, announcement?.poll?.poll_id || 0);
  const { mutate: respondToPoll } = useRespondToPoll();
  const [commentContent, setCommentContent] = useState('');
  const [attachmentSizes, setAttachmentSizes] = useState<{ [key: number]: string }>({});
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:8989');
    socket.on('connect', () => {
      socket.emit('join', `announcement_${announcementId}`);
    });
    socket.on('newComment', () => {
      refetchComments();
    });
    return () => {
      socket.disconnect();
    };
  }, [announcementId, refetchComments]);

  useEffect(() => {
    if (announcement?.attachments) {
      const fetchSizes = async () => {
        const sizes: { [key: number]: string } = {};
        for (let i = 0; i < announcement.attachments.length; i++) {
          const attachment = announcement.attachments[i];
          try {
            const response = await fetch(attachment.url, { method: 'HEAD' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const size = response.headers.get('content-length');
            sizes[i] = size ? `${(parseInt(size) / 1024).toFixed(2)} KB` : 'Size unavailable';
          } catch (err) {
            sizes[i] = 'Size unavailable';
            console.error(`Error fetching size for ${attachment.url}:`, err);
          }
        }
        setAttachmentSizes(sizes);
      };
      fetchSizes();
    }
  }, [announcement]);

  const handlePollResponse = (optionId: number) => {
    if (announcement?.poll?.poll_id) {
      respondToPoll(
        { accessToken: accessToken!, pollId: announcement.poll.poll_id, optionId },
        {
          onSuccess: () => {
            refetchPollResponses();
            queryClient.invalidateQueries({queryKey: ['pollResponses', announcement.poll.poll_id]});
          },
        }
      );
    }
  };

  const handleCreateComment = () => {
    if (commentContent.trim() === '') return;
    createComment(
      { accessToken: accessToken!, data: { type: 'generalAnnouncement', targetId: Number(announcementId), content: commentContent } },
      {
        onSuccess: () => {
          setCommentContent('');
          refetchComments();
        },
      }
    );
  };

  const isAdminOrSuperAdmin = user?.role === 'Admin' || user?.role === 'SuperAdmin';

  const voteCounts = announcement?.poll?.options?.reduce((acc, option) => {
    acc[option.option_id] = pollResponses?.filter((r) => r.poll_option_id === option.option_id).length || 0;
    return acc;
  }, {} as { [key: number]: number });

  const totalVotes = announcement?.poll?.options?.reduce((sum, option) => sum + (voteCounts?.[option.option_id] || 0), 0) || 0;

  const getFileInfo = (url: string) => {
    if (url.endsWith('.pdf')) return { icon: <FileText className="w-6 h-6 text-red-500" />, type: 'PDF' };
    if (url.match(/\.(doc|docx)$/i)) return { icon: <File className="w-6 h-6 text-blue-500" />, type: 'DOCX' };
    if (url.match(/\.(jpeg|jpg|png|gif)$/i)) return { icon: <Image className="w-6 h-6 text-green-500" />, type: 'IMG' };
    if (url.match(/\.(mp4|mov)$/i)) return { icon: <File className="w-6 h-6 text-purple-500" />, type: 'VIDEO' };
    return { icon: <File className="w-6 h-6 text-gray-500" />, type: 'UNKNOWN' };
  };

  const closeModal = () => setSelectedAttachment(null);

  if (isLoading) return <ContentContainer><div className="text-white p-4">Loading...</div></ContentContainer>;
  if (error || !announcement) return <ContentContainer><div className="text-red-500 p-4">{error?.message || 'Announcement not found'}</div></ContentContainer>;

  return (
    <ErrorBoundary>
      <ContentContainer>
        <div className="p-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-400 hover:underline"
            >
              ← Back to announcements
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{announcement.title}</h1>
          <p className="text-gray-400 mb-4">
            By {announcement.admin.user.name} on {new Date(announcement.created_at).toLocaleDateString()}
          </p>
          <div className="text-gray-300 mb-6">
            <h2 className="text-xl font-semibold mb-2">Announcement Details</h2>
            <p>{announcement.content || 'No details provided.'}</p>
          </div>
          {announcement.attachments?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Attachments</h2>
              {announcement.attachments.map((attachment, index) => {
                const fileName = attachment.originalName || attachment.url.split('/').pop()?.split('?')[0] || `file_${index}`;
                const { icon, type } = getFileInfo(attachment.url);
                return (
                  <div
                    key={index}
                    className="flex items-center mb-2 p-2 bg-gray-700 rounded cursor-pointer"
                    onClick={() => setSelectedAttachment(attachment)}
                  >
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
          {selectedAttachment && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={closeModal}
            >
              <div
                className="relative bg-gray-800 p-6 rounded-lg max-w-4xl w-full h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-gray-300"
                >
                  ×
                </button>
                {selectedAttachment.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <img
                    src={selectedAttachment.url}
                    alt={selectedAttachment.originalName}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : selectedAttachment.url.endsWith('.pdf') ? (
                  <iframe src={selectedAttachment.url} title="PDF Viewer" className="w-full h-full" />
                ) : (
                  <div className="text-white text-center">
                    <p>Preview not available for {selectedAttachment.originalName}. Download to view.</p>
                    <a
                      href={selectedAttachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          {announcement.is_poll && announcement.poll && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Poll: {announcement.poll.type}</h2>
              {announcement.poll.options?.map((option) => {
                const votes = voteCounts?.[option.option_id] || 0;
                const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                const hasVoted = pollResponses?.some((r) => r.user_id === user?.userId && r.poll_option_id === option.option_id);
                return (
                  <div key={option.option_id} className="mb-2">
                    <label className="flex items-center space-x-2 text-gray-300">
                      {announcement.poll.allow_multiple_answers ? (
                        <input
                          type="checkbox"
                          checked={hasVoted}
                          onChange={() => handlePollResponse(option.option_id)}
                          className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                      ) : (
                        <input
                          type="radio"
                          name="pollOption"
                          checked={hasVoted}
                          onChange={() => handlePollResponse(option.option_id)}
                          className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
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
              {isAdminOrSuperAdmin && pollResponses && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white">Responses</h3>
                  {pollResponses.map((response) => (
                    <p key={response.response_id} className="text-gray-300">
                      {response.user?.name || 'Anonymous'} responded at {new Date(response.responded_at).toLocaleString()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Comments ({announcement._count?.comments || comments?.length || 0})
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
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleCreateComment}
                disabled={!commentContent.trim()}
                className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </ContentContainer>
    </ErrorBoundary>
  );
};

export default AnnouncementDetails;
