import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Eye } from 'lucide-react';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import { Button } from '@/components/ui/button';
import io from 'socket.io-client';
import { useCourseAnnouncements, useCreateCourseAnnouncement, usePollResponses, useRespondToPoll } from '@/hooks/api';
import { useAuth } from '@/context/auth';
import { useQueryClient } from '@tanstack/react-query';

interface PollResponse {
  user_id: number;
  poll_option_id: number;
  created_at: string;
}

const CourseAnnouncements: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { accessToken, user } = useAuth();
  const { data: announcements, isLoading, error } = useCourseAnnouncements(accessToken, Number(courseId));
  const { mutate: createCourseAnnouncement } = useCreateCourseAnnouncement();
  const { mutate: respondToPoll } = useRespondToPoll();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const pollIds = useMemo(() => 
    announcements?.filter((a) => a.is_poll && a.poll?.poll_id).map((a) => a.poll.poll_id) || [], 
    [announcements]
  );

  const pollResponsesQueries = pollIds.map((pollId) => usePollResponses(accessToken, pollId));
  const pollResponses = useMemo(() => {
    return pollIds.reduce((acc, pollId, index) => {
      acc[pollId] = pollResponsesQueries[index]?.data || [];
      return acc;
    }, {} as { [key: number]: PollResponse[] });
  }, [pollIds, pollResponsesQueries]);

  useEffect(() => {
    const socket = io('http://localhost:8989');
    socket.on('connect', () => {
      socket.emit('join', `course_${courseId}`);
    });
    socket.on('newAnnouncement', () => {
      queryClient.invalidateQueries({queryKey: ['courseAnnouncements', Number(courseId)]});
    });
    return () => {
      socket.disconnect();
    };
  }, [courseId]);

  const handleCreateAnnouncement = () => {
    createCourseAnnouncement(
      { accessToken: accessToken!, data: { courseId: Number(courseId), title, content } },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setTitle('');
          setContent('');
        },
      }
    );
  };

  const handlePollResponse = (pollId: number, optionId: number) => {
    respondToPoll(
      { accessToken: accessToken!, pollId, optionId },
      { onSuccess: () => queryClient.invalidateQueries({queryKey: ['pollResponses', pollId]}) }
    );
  };

  if (isLoading) return <ContentContainer><div>Loading...</div></ContentContainer>;
  if (error) return <ContentContainer><div>Error: {error.message || 'Failed to fetch announcements'}</div></ContentContainer>;
  if (!announcements?.length) return <ContentContainer><div>No announcements found.</div></ContentContainer>;

  return (
    <ContentContainer>
      <div className="flex justify-between items-center mb-4">
        <ThemedText variant="h2">Course Announcements</ThemedText>
        <Button onClick={() => setIsModalOpen(true)}>Create Announcement</Button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <ThemedText variant="h3" className="mb-4">Create New Announcement</ThemedText>
            {error && <p className="text-red-500 mb-4">{error.message || 'Failed to create announcement'}</p>}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement Title"
              className="w-full px-3 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Announcement Content"
              className="w-full px-3 py-2 mb-4 bg-gray-700 border border-gray-600 rounded-md text-white"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateAnnouncement} disabled={!title || !content}>Create</Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6">
        {announcements.map((announcement) => {
          const pollResponsesForPoll = announcement.poll?.poll_id ? pollResponses[announcement.poll.poll_id] || [] : [];
          const voteCounts = announcement.poll?.options?.reduce((acc, option) => {
            acc[option.option_id] = pollResponsesForPoll.filter((r) => r.poll_option_id === option.option_id).length || 0;
            return acc;
          }, {} as { [key: number]: number });
          const totalVotes = announcement.poll?.options?.reduce((sum, option) => sum + (voteCounts?.[option.option_id] || 0), 0) || 0;

          return (
            <div
              key={announcement.announcement_id}
              className={`bg-gray-800 rounded-lg p-6 ${announcement.is_poll ? 'border-l-4 border-yellow-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {announcement.teacher.user.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <ThemedText variant="h4">{announcement.teacher.user.name}</ThemedText>
                    <ThemedText variant="small">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </ThemedText>
                  </div>
                </div>
              </div>
              <ThemedText variant="h3" className="mb-3">{announcement.title}</ThemedText>
              <ThemedText variant="body" className="mb-4 line-clamp-2">{announcement.content}</ThemedText>
              {announcement.is_poll && announcement.poll && (
                <div className="mb-4">
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
                <ThemedText variant="small" className="text-blue-400 mb-4">
                  {announcement.attachments.length} attachments
                </ThemedText>
              )}
              <div className="flex items-center justify-between text-gray-400">
                <div className="flex items-center space-x-2">
                  <MessageCircle size={16} />
                  <ThemedText variant="small">{announcement._count?.comments || 0} comments</ThemedText>
                </div>
                <div
                  className="flex items-center space-x-1 text-blue-400 cursor-pointer"
                  onClick={() => navigate(`/courses/${courseId}/announcements/${announcement.announcement_id}`)}
                >
                  <Eye size={16} />
                  <ThemedText variant="small">View Details</ThemedText>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ContentContainer>
  );
};

export default CourseAnnouncements;