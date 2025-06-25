import {api} from './';

export const createCourseAnnouncement = async (
    data: {
      courseId: number,
    title: string;
    content: string;
    is_poll?: boolean;
    poll?: { allow_multiple_answers: boolean; type: string; options: string[] };
    attachments?: string[];
  }
): Promise<any> => {
    console.log(data)
  const response = await api.post(`/announcements/course/`, data);
  return response.data;
};

export const getCourseAnnouncements = async (
  courseId: number,
  page: number = 1,
  limit: number = 10
): Promise<any[]> => {
  const response = await api.get(`/announcements/course/`, {
    params: { courseId, page, limit },
  });
  return response.data;
};

export const getCourseAnnouncementDetails = async (announcementId: number): Promise<any> => {
  const response = await api.get(`/announcements/course/${announcementId}`);
  return response.data;
};