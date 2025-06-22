import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Eye } from 'lucide-react';
import ContentContainer from '@/components/commons/containers/ContentContainer';
import ThemedText from '@/components/commons/typography/ThemedText';
import io from 'socket.io-client';
import { useGeneralAnnouncements, usePollResponses, useRespondToPoll } from '@/hooks/api';
import { useAuth } from '@/context/auth';
import { useQueryClient } from '@tanstack/react-query';

interface PollResponse {
  user_id: number;
  poll_option_id: number;
  created_at: string;
}

const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const { data: announcements, isLoading, error } = useGeneralAnnouncements(accessToken);
  const { mutate: respondToPoll } = useRespondToPoll();
  const queryClient = useQueryClient()

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

  React.useEffect(() => {
    const socket = io('http://localhost:8989');
    socket.on('connect', () => {
      socket.emit('join', 'generalAnnouncements');
    });
    socket.on('newAnnouncement', () => {
      queryClient.invalidateQueries({ queryKey: ['generalAnnouncements']});
    });
    socket.on('updateAnnouncement', () => {
      queryClient.invalidateQueries({ queryKey: ['generalAnnouncements']});
    });
    socket.on('deleteAnnouncement', () => {
      queryClient.invalidateQueries({ queryKey: ['generalAnnouncements']});
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePollResponse = (pollId: number, optionId: number) => {
    respondToPoll({ accessToken: accessToken!, pollId, optionId });
  };

  if (isLoading) return <ContentContainer><div>Loading...</div></ContentContainer>;
  if (error) return <ContentContainer><div>Error: {error.message || 'Failed to fetch announcements'}</div></ContentContainer>;
  if (!announcements?.length) return <ContentContainer><div>No announcements found.</div></ContentContainer>;

  return (
    <ContentContainer>
      <ThemedText variant="h2">General Announcements</ThemedText>
      <div className="space-y-6 mt-4">
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
                      {announcement.admin.user.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <ThemedText variant="h4">{announcement.admin.user.name}</ThemedText>
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
                  onClick={() => navigate(`/announcements/${announcement.announcement_id}`)}
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

export default Announcements;