import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCreateComment, useGetComments } from "@/hooks/api/index";
import {
  useGetAnnouncementDetails,
  useGetPollResponses,
  useRespondToPoll,
} from "@/hooks/api/";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api/index";
import { MoreVertical, File, FileText, Image } from "lucide-react";
import { useCommentSocket } from "@/hooks/api/useComments";
import CommentList from "@/components/commons/lists/CommentList";
import ThemedText from "@/components/commons/typography/ThemedText";
import BackHeader from "@/components/commons/navigation/BackHeader";
import ContentContainer from "@/components/commons/containers/ContentContainer";
import { getTimeAgo } from "@/utils/dateFormatter";

const AnnouncementDetails: React.FC = () => {
  const { announcementId } = useParams<{ announcementId: string }>();
  const navigate = useNavigate();
  const {
    data: announcement,
    isLoading,
    error,
  } = useGetAnnouncementDetails(announcementId);
  const { data: comments, isLoading: commentsLoading } = useGetComments(
    "generalAnnouncement",
    announcementId
  );
  const { mutate: addComment } = useCreateComment();
  const [newComment, setNewComment] = useState("");
  useCommentSocket(announcementId);

  // Poll-related state and hooks
  const { mutate: respondToPoll } = useRespondToPoll();
  const { data: pollResponses } = useGetPollResponses(
    announcement?.poll?.poll_id || 0
  );
  const queryClient = useQueryClient();
  const [attachmentSizes, setAttachmentSizes] = useState<{
    [key: number]: string;
  }>({});
  const [selectedAttachment, setSelectedAttachment] = useState<{
    url: string;
    originalName: string;
  } | null>(null);

  useEffect(() => {
    if (announcement?.attachments) {
      const fetchSizes = async () => {
        const sizes = {};
        for (let i = 0; i < announcement.attachments.length; i++) {
          const attachment = announcement.attachments[i];
          try {
            const response = await fetch(attachment.url, { method: "HEAD" });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const size = response.headers.get("content-length");
            sizes[i] = size
              ? `${(parseInt(size) / 1024).toFixed(2)} KB`
              : "Size unavailable (server-side fetch required)";
            if (!size && attachment.url.match(/\.(pdf|docx)$/i)) {
              console.warn(
                `No content-length for ${attachment.url}. Consider backend API for accurate size.`
              );
            }
          } catch (err) {
            sizes[i] = "Size unavailable (error fetching)";
            console.error(`Error fetching size for ${attachment.url}:`, err);
          }
        }
        setAttachmentSizes(sizes);
      };
      fetchSizes();
    }
  }, [announcement]);

  if (isLoading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-500 p-4">{error.message}</p>;
  if (!announcement)
    return <p className="text-white p-4">Announcement not found.</p>;

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    addComment(
      {
        type: "generalAnnouncement",
        targetId: announcementId,
        content: newComment,
      },
      {
        onSuccess: () => setNewComment(""),
      }
    );
  };

  const handlePollResponse = (optionId: number) => {
    if (announcement.poll?.poll_id) {
      respondToPoll(
        { pollId: announcement.poll.poll_id, optionId },
        {
          onSuccess: (response) => {
            queryClient.invalidateQueries({
              queryKey: ["pollResponses", announcement.poll.poll_id],
            });
            api
              .get(`/polls/${announcement.poll.poll_id}/responses`)
              .then((res) => {
                queryClient.setQueryData(
                  ["pollResponses", announcement.poll.poll_id],
                  res.data
                );
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
    acc[option.option_id] =
      pollResponses?.filter((r) => r.poll_option_id === option.option_id)
        .length || 0;
    return acc;
  }, {} as { [key: number]: number });

  const totalVotes =
    announcement.poll?.options?.reduce(
      (sum, option) => sum + (voteCounts?.[option.option_id] || 0),
      0
    ) || 0;

  // Helper to determine icon and type based on file type
  const getFileInfo = (url: string) => {
    if (url.endsWith(".pdf"))
      return { icon: <FileText className="w-6 h-6 text-error" />, type: "PDF" };
    if (url.endsWith(".doc") || url.endsWith(".docx"))
      return { icon: <File className="w-6 h-6 text-blue-500" />, type: "DOCX" };
    if (url.match(/\.(jpeg|jpg|png|gif)$/i))
      return {
        icon: <Image className="w-6 h-6 text-green-500" />,
        type: "IMG",
      };
    if (url.endsWith(".mp4") || url.endsWith(".mov"))
      return {
        icon: <File className="w-6 h-6 text-purple-500" />,
        type: "VIDEO",
      };
    return {
      icon: <File className="w-6 h-6 text-gray-500" />,
      type: "UNKNOWN",
    };
  };

  const closeModal = () => setSelectedAttachment(null);

  return (
    <ContentContainer>
      <BackHeader title="Back to announcements" backUrl="/announcements" />
      <div className="flex gap-2 mb-4 mt-6">
        <img
          src=""
          alt=""
          className="w-10 h-10 rounded-full bg-background-neutral"
        />
        <div className="flex-1">
          <ThemedText variant="h4">{announcement.admin.user.name}</ThemedText>
          <ThemedText variant="caption" className="text-neutral-text-tertiary">
            {getTimeAgo(announcement.created_at)}
          </ThemedText>
        </div>
      </div>

      <div className="mb-6">
        <ThemedText variant="h2" className="text-xl mb-2 text-neutral-text-primary">{announcement.title}</ThemedText>
        <ThemedText>{announcement.content}</ThemedText>
      </div>
      {announcement.attachments?.length > 0 && (
        <div className="mb-6">
          {announcement.attachments.map((attachment, index) => {
            const fileName =
              attachment.originalName ||
              attachment.url.split("/").pop()?.split("?")[0] ||
              `file_${index}`;
            const { icon, type } = getFileInfo(attachment.url);
            return (
              <div
                key={index}
                className="flex mb-2 cursor-pointer w-fit"
                onClick={() => setSelectedAttachment(attachment)}
              >
                {icon}
                <div className="ml-3 flex-1">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-text-secondary text-sm"
                  >
                    {fileName}
                  </a>
                  <div className="flex gap-5 items-center">
                    <ThemedText className="text-xs text-neutral-text-tertiary">
                      {type.toLowerCase()}
                    </ThemedText>
                    {type.toLowerCase() !== "video" &&
                      type.toLowerCase() !== "img" && (
                        <ThemedText className="text-xs text-neutral-text-tertiary">
                          {12} pages
                        </ThemedText>
                      )}
                    <ThemedText className="text-xs text-neutral-text-tertiary">
                      {attachmentSizes[index] || "Loading..."}
                    </ThemedText>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Viewing Attachments */}
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
            ) : selectedAttachment.url.endsWith(".pdf") ? (
              <iframe
                src={selectedAttachment.url}
                title="PDF Viewer"
                className="w-full h-full"
              />
            ) : (
              <div className="text-white text-center">
                <p>
                  Preview not available for {selectedAttachment.originalName}.
                  Download to view.
                </p>
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

      {/* Poll Section */}
      {announcement.is_poll && announcement.poll && (
        <div className="mb-6">
          {announcement.poll.options?.map((option) => {
            const votes = voteCounts?.[option.option_id] || 0;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            const hasVoted = pollResponses?.some(
              (r) =>
                r.user_id === currentUserId &&
                r.poll_option_id === option.option_id
            );
            return (
              <div key={option.option_id} className="mb-2">
                <label className="flex items-center space-x-2 text-neutral-text-secondary">
                  {announcement.poll.allow_multiple_answers ? (
                    <input
                      type="checkbox"
                      checked={hasVoted}
                      onChange={() => handlePollResponse(option.option_id)}
                      className="h-4 w-4 text-primary-base bg-background-neutral border-neutral-border rounded"
                      disabled={!isTeacher} // Disable if not a teacher
                    />
                  ) : (
                    <input
                      type="radio"
                      name="pollOption"
                      checked={hasVoted}
                      onChange={() => handlePollResponse(option.option_id)}
                      className="h-4 w-4 text-primary-base bg-background-neutral border-neutral-border rounded"
                      disabled={!isTeacher} // Disable if not a teacher
                    />
                  )}
                  <span>{option.content}</span>
                </label>
                <div className="w-full bg-background-neutral rounded-full h-2.5 mt-1">
                  <div
                    className="bg-primary-base h-2.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <ThemedText variant="caption">{votes} votes</ThemedText>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-8">
        <ThemedText className="text-neutral-text-secondary mb-4 pt-6 border-t border-neutral-border">
          Comments ({announcement._count?.comments || 0})
        </ThemedText>
        <CommentList
          comments={comments}
          isLoading={commentsLoading}
          totalComments={announcement._count?.comments || 0}
        />
        <div className="flex items-center space-x-3 mt-8">
          <input
            type="text"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-2 bg-background-neutral rounded-[100px] text-neutral-text-secondary text-sm"
          />
          {!!newComment && <button
            onClick={handleAddComment}
            className="flex justify-center items-center bg-primary-base rounded-full w-9 h-9 text-white pl-1"
            disabled={!newComment.trim() || isLoading}
          >
                      <span className="material-icons">send</span>
          </button>}

        </div>
      </div>
    </ContentContainer>
  );
};

export default AnnouncementDetails;
