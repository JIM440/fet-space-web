import axios from 'axios';
import { uploadToCloudinary } from '../cloudinary';

export const api = axios.create({
  baseURL: 'http://localhost:8989',
  headers: { 'Content-Type': 'application/json' },
});

export const login = async (identifier: string, password: string, role: string) => {
  const response = await api.post('/auth/login', { identifier, password, role });
  return response.data;
};

export const fetchTeacherCourses = async () => {
  const response = await api.get('/teacher/courses/mine');
  return response.data;
};

export const createCourse = async (data: { code: string, title: string; subtitle: string, description: string }) => {
  const response = await api.post('/teacher/courses/create', data);
  return response.data;
};

export const fetchGeneralAnnouncements = async ( page: number = 1, limit: number = 10) => {
  const response = await api.get(`/announcements/general?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchCourseAnnouncements = async ( courseId: number, page: number = 1, limit: number = 10) => {
  const response = await api.get(`/announcements/course?courseId=${courseId}&page=${page}&limit=${limit}`);
  return response.data;
};

export const createCourseAnnouncement = async (data: { courseId: number; title: string; content: string }) => {
  const response = await api.post('/announcements/course', data);
  return response.data;
};

export const fetchComments = async (type: string, targetId: number, page: number = 1, limit: number = 10) => {
  const response = await api.get(`/comments?type=${type}&targetId=${targetId}&page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchPollResponses = async (pollId: number) => {
  const response = await api.get(`/polls/${pollId}/responses`);
  return response.data;
};

export const respondToPoll = async (pollId: number, optionId: number) => {
  const response = await api.post('/polls/respond', { pollId, optionId });
  return response.data;
};

export const getCourseDetails = async (courseId: number): Promise<any> => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch course details:', error);
    throw error;
  }
};

export const getCoursePersons = async (courseId: number): Promise<any> => {
  try {
    const response = await api.get(`/courses/${courseId}/persons`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch course persons:', error);
    throw error;
  }
};

export const getCourseContents = async (courseId: number): Promise<any> => {
  try {
    const response = await api.get(`/courses/${courseId}/contents`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch course contents:', error);
    throw error;
  }
};

export const uploadCourseContent = async (courseId: number, file: File) => {
  const { url, file_type } = await uploadToCloudinary(file, 'course_content');
  const response = await api.post(`/teacher/courses/${courseId}/content`, {
    url,
    file_type  });
  return response.data;
};

export const uploadRevisionQuestions = async (courseId: number, file: File) => {
  const { url, file_type } = await uploadToCloudinary(file, 'revision_questions');
  const response = await api.post(`/teacher/courses/${courseId}/revision-questions`, {
    url,
    file_type,
  });
  return response.data;
};

export const getCourseAssignments = async (courseId: number): Promise<any> => {
  try {
    const response = await api.get(`/courses/${courseId}/assignments`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch course assignments:', error);
    throw error;
  }
};

export const getCourseRevisionQuestions = async (courseId: number): Promise<any> => {
  try {
    const response = await api.get(`/courses/${courseId}/revision-questions`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch revision questions:', error);
    throw error;
  }
};

export const getCourseAnnouncements = async (courseId: number): Promise<any> => {
  try {
    const response = await api.get(`/courses/${courseId}/announcements`); // Adjust endpoint if needed
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch course announcements:', error);
    throw error;
  }
};