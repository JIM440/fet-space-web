import {api} from './';
// Interface definitions (adjust as per your API response structure)
interface Comment {
  comment_id: number;
  user: { name: string; user_id: number };
  content: string;
  targetId: number;
  type: string;
  created_at: string;
}

interface PollResponse {
  response_id: number;
  user_id: number;
  poll_option_id: number;
  pollId: number;
  responded_at: string;
}

interface Announcement {
  announcement_id: number;
  title: string;
  content: string;
  created_at: string;
  admin: { user_id: number; user: { name: string; email: string; role: string } };
  poll?: any;
  attachments?: any[];
  _count?: { comments: number };
}

// Existing functions (kept for context, adjust if already defined elsewhere)
// ... (e.g., login, fetchTeacherCourses, etc.)

// Comment-related API functions
export const fetchComments = async (type: string, targetId: number): Promise<Comment[]> => {
  const response = await api.get(`/comments/${type}/${targetId}`);
  return response.data;
};

export const createComment = async (type: string, targetId: number, content: string): Promise<Comment> => {
  const response = await api.post(`/comments/`, { type, targetId, content });
  return response.data;
};

// Poll-related API functions
export const fetchPollResponses = async (pollId: number): Promise<PollResponse[]> => {
  const response = await api.get(`/polls/${pollId}/responses`);
  return response.data;
};

export const respondToPoll = async (data: { pollId: number; optionId: number }): Promise<any> => {
  const response = await api.post('/polls/respond', data);
  return response.data;
};

// Existing announcement-related functions (kept for context, adjust if already defined elsewhere)
export const getAnnouncements = async (
  page: number = 1,
  limit: number = 10
): Promise<Announcement[] | null> => {
  const response = await api.get('/announcements/general', {
    params: { page, limit },
  });
  return response.data;
};

export const getAnnouncementDetails = async (
  announcementId: number
): Promise<Announcement | null> => {
  const response = await api.get(`/announcements/general/${announcementId}`);
  console.log(response.data)
  return response.data;
};

export const getPollResponses = async (pollId: number): Promise<any[]> => {
  const response = await api.get(`/polls/${pollId}/responses`);
  return response.data;
};