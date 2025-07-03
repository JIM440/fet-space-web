import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCourseAnnouncements,
  useCourseAnnouncementSocket,
} from "@/hooks/api/useCourseAnnouncements";
import ThemedText from "@/components/commons/typography/ThemedText";
import InlineSpinner from "@/components/commons/loader/InlineSpinner";
import ErrorComponent from "@/components/commons/error/ErrorComponent";
import AddCommentInput from "@/components/commons/inputs/AddCommentInput";
import ContentContainer from "@/components/commons/containers/ContentContainer";
import { getTimeAgo } from "@/utils/dateFormatter";
import { api } from "@/utils/api";
import { useAuth } from "@/context/auth";


const CourseAnnouncements: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    data: announcements,
    isLoading,
    error,
    refetch
  } = useCourseAnnouncements(parseInt(courseId || "0"), 1, 10);
  useCourseAnnouncementSocket(parseInt(courseId || "0"));

    const {user} = useAuth()
    const currentUserId = user?.userId; // Replace with actual user ID from auth

    // State to store poll responses
    const [pollResponses, setPollResponses] = useState<{ [key: number]: any[] }>(
      {}
    );
  
    // Fetch poll responses for all poll IDs
    const pollIds = useMemo(
      () =>
        announcements
          ?.filter((a) => a.is_poll && a.poll?.poll_id)
          .map((a) => a.poll.poll_id) || [],
      [announcements]
    );
  
    useEffect(() => {
      const fetchPollResponses = async () => {
        const responses = await Promise.all(
          pollIds.map(async (pollId) => {
            const response = await api.get(`/polls/${pollId}/responses`);
            return { pollId, data: response.data };
          })
        );
        const responsesMap = responses.reduce((acc, { pollId, data }) => {
          acc[pollId] = data;
          return acc;
        }, {} as { [key: number]: any[] });
        setPollResponses(responsesMap);
      };
      if (pollIds.length > 0) fetchPollResponses();
    }, [pollIds]);
  

  if (isLoading) return <InlineSpinner />;
  if (error) return <ErrorComponent message={`Error: ${error.message || 'Failed to load assignments'}`} onRetry={refetch} />
    if (!announcements?.length || announcements.length === 0)
    return <ThemedText className="text-center">No announcements found.</ThemedText>;


  return (
    <ContentContainer>
      <div className="space-y-6 md:mt-[-20px]">
        {announcements?.map((announcement) => {
          const pollResponsesForPoll = announcement.poll?.poll_id
            ? pollResponses[announcement.poll.poll_id] || []
            : [];
          const voteCounts = announcement.poll?.options?.reduce(
            (acc, option) => {
              acc[option.option_id] =
                pollResponsesForPoll.filter(
                  (r) => r.poll_option_id === option.option_id
                ).length || 0;
              return acc;
            },
            {} as { [key: number]: number }
          );
          const totalVotes =
            announcement.poll?.options?.reduce(
              (sum, option) => sum + (voteCounts?.[option.option_id] || 0),
              0
            ) || 0;

          return (
            <div
              key={announcement.announcement_id}
              className={`p-5 cursor-pointer border-1 border-neutral-border }`}
              onClick={() =>
                navigate(
                  `/courses/${courseId}/announcements/${announcement.announcement_id}`
                )
              }
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="../../../src/assets/images/admins/fozin.jpg"
                    alt=""
                    className="w-10 h-10 rounded-full bg-background-neutral"
                  />
                  <div>
                    <ThemedText variant="h4">
                      {announcement.teacher.user.name}
                    </ThemedText>
                    <ThemedText variant="caption">
                      {getTimeAgo(announcement.created_at)}
                    </ThemedText>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <ThemedText variant="h3" className="text-neutral-text-primary">
                  {announcement.title}
                </ThemedText>
                {!announcement.is_poll && <ThemedText className="text-neutral-text-secondary">
                  {announcement.content}
                </ThemedText>}
              </div>
              {announcement.is_poll && announcement.poll && (
                <div className="mb-4">
                  {announcement.poll.options?.map((option) => {
                    const votes = voteCounts?.[option.option_id] || 0;
                    const percentage =
                      totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                    const hasVoted = pollResponsesForPoll.some(
                      (r) =>
                        r.user_id === currentUserId &&
                        r.poll_option_id === option.option_id
                    );
                    return (
                      <div key={option.option_id} className="mb-4">
                        <label className="flex items-center space-x-2 text-neutral-text-secondary">
                          {announcement.poll.allow_multiple_answers ? (
                            <input
                              type="checkbox"
                              checked={hasVoted}
                              onChange={() =>
                                handlePollResponse(
                                  announcement.announcement_id,
                                  option.option_id,
                                  announcement.poll.poll_id
                                )
                              }
                              className="h-4 w-4 text-primary-base"
                              // disabled={!isTeacher} // Disable if not a teacher (for consistency, though teachers can vote)
                            />
                          ) : (
                            <input
                              type="radio"
                              name={`pollOption-${announcement.announcement_id}`} // Unique name per announcement
                              checked={hasVoted}
                              onChange={() =>
                                handlePollResponse(
                                  announcement.announcement_id,
                                  option.option_id,
                                  announcement.poll.poll_id
                                )
                              }
                              className="h-4 w-4 text-neutral-text-secondary bg-background-neutral"
                              // disabled={!isTeacher} // Disable if not a teacher
                            />
                          )}
                          <span>{option.content}</span>
                        </label>
                        <div className="w-full bg-background-neutral rounded-full h-2 mt-1">
                          <div
                            className="bg-primary-base h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <ThemedText
                          variant="caption"
                          className="text-sm text-neutral-text-secondary"
                        >
                          {votes} votes
                        </ThemedText>
                      </div>
                    );
                  })}
                </div>
              )}
              {announcement.attachments?.length > 0 && (
                <ThemedText variant="caption" className="text-primary-base">
                  {announcement.attachments.length} attachments
                </ThemedText>
              )}
              {announcement._count?.comments > 0 ? (
                <div className="flex justify-end space-x-2">
                  <ThemedText
                    variant="caption"
                    className="text-right block mt-4"
                  >
                    {announcement._count?.comments || 0} comments
                  </ThemedText>
                </div>
              ) : (
                <AddCommentInput
                  value=""
                  onChangeText={() => {}}
                  disabled={true}
                />
              )}
            </div>
          );
        })}
      </div>
    </ContentContainer>
  );
};

export default CourseAnnouncements;