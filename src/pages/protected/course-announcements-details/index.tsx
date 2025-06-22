import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import { Button } from '@/components/ui/button';
import io from 'socket.io-client';
import { useCourseAnnouncements, useComments, useCreateComment, usePollResponses, useRespondToPoll } from '@/hooks/api';
import { useAuth } from '@/context/auth';

interface PollResponse {
  user_id: number;
  poll_option_id: number;
  created_at: string;
}

const CourseAnnouncementDetails: React.FC = () => {
  const { courseId, announcementId } = useParams<{ courseId: string; announcementId: string }>();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const { data: announcements, isLoading, error } = useCourseAnnouncements(accessToken, Number(courseId));
  const announcement = announcements?.find((a: any) => a.announcement_id === Number(announcementId));
  const { data: comments, refetch: refetchComments } = useComments(accessToken, 'courseAnnouncement', Number(announcementId));
  const { mutate: createComment } = useCreateComment();
  const { data: pollResponses, refetch: refetchPollResponses } = usePollResponses(accessToken, announcement?.poll?.poll_id);
  const { mutate: respondToPoll } = useRespondToPoll();
  const [commentContent, setCommentContent] = useState('');

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

  const handlePollResponse = (pollId: number, optionId: number) => {
    respondToPoll(
      { accessToken: accessToken!, pollId, optionId },
      { onSuccess: () => refetchPollResponses() }
    );
  };

  const handleCreateComment = () => {
    createComment(
      { accessToken: accessToken!, data: { type: 'courseAnnouncement', targetId: Number(announcementId), content: commentContent } },
      {
        onSuccess: () => {
          setCommentContent('');
          refetchComments();
        },
      }
    );
  };

  if (isLoading) return <ContentContainer><div>Loading...</div></ContentContainer>;
  if (error || !announcement) return <ContentContainer><div>Error: {error?.message || 'Announcement not found'}</div></ContentContainer>;

  const pollResponsesForPoll = announcement.poll?.poll_id ? pollResponses || [] : [];
  const voteCounts = announcement.poll?.options?.reduce((acc, option) => {
    acc[option.option_id] = pollResponsesForPoll.filter((r) => r.poll_option_id === option.option_id).length || 0;
    return acc;
  }, {} as { [key: number]: number });
  const totalVotes = announcement.poll?.options?.reduce((sum, option) => sum + (voteCounts?.[option.option_id] || 0), 0) || 0;

  return (
    <ContentContainer>
      <ThemedText variant="h2">{announcement.title}</ThemedText>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {announcement.teacher.user.name.split(' ').map((n) => n[0]).join('')}
          </span>
        </div>
        <div>
          <ThemedText variant="h4">{announcement.teacher.user.name}</ThemedText>
          <ThemedText variant="small">{new Date(announcement.created_at).toLocaleDateString()}</ThemedText>
        </div>
      </div>
      <ThemedText variant="body">{announcement.content}</ThemedText>
      {announcement.is_poll && announcement.poll && (
        <div className="mt-4">
          <ThemedText variant="small" className="text-yellow-400 mb-2">📊 Poll: {announcement.poll.type}</ThemedText>
          {announcement.poll.options?.map((option) => {
            const votes = voteCounts?.[option.option_id] || 0;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            const hasVoted = pollResponsesForPoll.some((r) => r.user_id === user?.userId && r.poll_option_id === option.option_id);
            return (
              <div key={option.option_id} className="mb-2">
                <label className="flex items-center space-x-2 text-gray-300">
                  {announcement.poll.allow_multiple_answers ? (
                    <input
                      type="checkbox"
                      checked={hasVoted}
                      onChange={() => handlePollResponse(announcement.poll.poll_id, option.option_id)}
                      className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                  ) : (
                    <input
                      type="radio"
                      name={`pollOption-${announcement.announcement_id}`}
                      checked={hasVoted}
                      onChange={() => handlePollResponse(announcement.poll.poll_id, option.option_id)}
                      className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                  )}
                  <span>{option.content}</span>
                </label>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <ThemedText variant="small" className="text-gray-400">{votes} votes</ThemedText>
              </div>
            );
          })}
        </div>
      )}
      {announcement.attachments?.length > 0 && (
        <ThemedText variant="small" className="text-blue-400 mt-4">
          {announcement.attachments.length} attachments
        </ThemedText>
      )}
      <div className="mt-6">
        <ThemedText variant="h3">Comments</ThemedText>
        {comments?.length === 0 ? (
          <ThemedText variant="body" className="mt-2">No comments yet.</ThemedText>
        ) : (
          comments?.map((comment) => (
            <div key={comment.comment_id} className="mt-2 p-4 bg-gray-700 rounded">
              <ThemedText variant="small">{comment.user.name} ({comment.user.role})</ThemedText>
              <ThemedText variant="body">{comment.content}</ThemedText>
              <ThemedText variant="small" className="text-gray-400">
                {new Date(comment.created_at).toLocaleDateString()}
              </ThemedText>
            </div>
          ))
        )}
        <div className="mt-4">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            rows={4}
          />
          <Button
            onClick={handleCreateComment}
            disabled={!commentContent}
            className="mt-2"
          >
            Post Comment
          </Button>
        </div>
      </div>
    </ContentContainer>
  );
};

export default CourseAnnouncementDetails;