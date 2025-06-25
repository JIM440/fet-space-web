import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCourseAnnouncements,
  useCourseAnnouncementSocket,
} from "@/hooks/api/useCourseAnnouncements";
import ThemedText from "@/components/commons/typography/ThemedText";
import InlineSpinner from "@/components/commons/loader/InlineSpinner";
import ErrorComponent from "@/components/commons/error/ErrorComponent";

// Extended interface to include comments, votes, and attachments
interface Announcement {
  announcement_id: number;
  title: string;
  content: string;
  created_at: string;
  teacher: { user: { name: string } };
  comments_count?: number;
  votes_count?: number;
  has_attachments?: boolean;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  courseId: string;
  navigate: (path: string) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  courseId,
  navigate,
}) => {
  const truncatedContent =
    announcement.content.length > 100
      ? `${announcement.content.substring(0, 100)}...`
      : announcement.content;

  return (
    <div className="bg-gray-900 p-4 rounded-md mb-4 border border-gray-800">
      <div className="flex items-center mb-2">
        <img
          src="https://via.placeholder.com/40" // Replace with actual user image URL
          alt={`${announcement.teacher.user.name}'s profile`}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <ThemedText className="text-white font-semibold">
            {announcement.teacher.user.name}
          </ThemedText>
          <ThemedText className="text-gray-500 text-sm">
            {new Date(announcement.created_at).toLocaleDateString()}
          </ThemedText>
        </div>
      </div>
      <ThemedText variant="h3" className="text-white text-lg mb-2">
        {announcement.title}
      </ThemedText>
      <ThemedText className="text-gray-400 mb-2">{truncatedContent}</ThemedText>
      {announcement.has_attachments && (
        <ThemedText className="text-gray-500 text-sm mb-2">
          {announcement.has_attachments} attachment(s)
        </ThemedText>
      )}
      <div className="flex justify-between text-gray-500 text-sm">
        <span>{announcement.comments_count || 0} comments</span>
        <span>{announcement.votes_count || 0} votes</span>
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Add a comment"
          className="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none"
        />
      </div>
      <button
        onClick={() =>
          navigate(
            `/course-announcement/${courseId}/announcements/${announcement.announcement_id}`
          )
        }
        className="mt-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        View Details
      </button>
    </div>
  );
};

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

  if (isLoading) return <InlineSpinner />;
  if (error) return <ErrorComponent message={`Error: ${error.message || 'Failed to load assignments'}`} onRetry={refetch} />

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {(!announcements || announcements.length === 0) && (
        <>
          <ThemedText className="text-center mb-4 text-gray-400">
            No announcements found.
          </ThemedText>
          <ThemedText className="text-center mb-4 text-gray-400">
            Click the button (+) to send out announcements.
          </ThemedText>
        </>
      )}
      <ul className="space-y-6">
        {announcements &&
          announcements.map((announcement: Announcement) => (
            <li key={announcement.announcement_id}>
              <AnnouncementCard
                announcement={announcement}
                courseId={courseId || ""}
                navigate={navigate}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CourseAnnouncements;