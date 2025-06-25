import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  fetchTeacherCourses,
  createCourse,
  fetchCourseAnnouncements,
  createCourseAnnouncement,
  fetchComments,
  api,
} from "@/utils/api";
import {
  getAnnouncementDetails,
  getPollResponses,
  createComment,
} from '@/utils/api/announcementApi';
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';

const socket: Socket = io('http://localhost:8989');

// Authentication
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      identifier,
      password,
      role,
    }: {
      identifier: string;
      password: string;
      role: string;
    }) => login(identifier, password, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

// Teacher Courses
export const useTeacherCourses = (accessToken: string | null) => {
  return useQuery({
    queryKey: ["teacherCourses"],
    queryFn: () => fetchTeacherCourses(),
    enabled: !!accessToken,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      accessToken: string;
      data: {
        code: string;
        title: string;
        subtitle: string;
        description: string;
      };
    }) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherCourses"] });
    },
  });
};

// Course Announcements
export const useCourseAnnouncements = (
  accessToken: string | null,
  courseId: number
) => {
  return useQuery({
    queryKey: ["courseAnnouncements", courseId],
    queryFn: () => fetchCourseAnnouncements(courseId),
    enabled: !!accessToken && !!courseId,
  });
};

export const useCreateCourseAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { courseId: number; title: string; content: string };
    }) => createCourseAnnouncement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courseAnnouncements", variables.data.courseId],
      });
    },
  });
};

// Search Functionality
export const useSearchStudent = (query: string, courseId: number) => {
  return useQuery({
    queryKey: ["searchStudents", query, courseId],
    queryFn: async () => {
      const safeQuery = query || "";
      if (!safeQuery.trim()) {
        return [];
      }
      const response = await api.get(
        `/teacher/create/${courseId}/search/students`,
        {
          params: { q: safeQuery },
        }
      );
      return response.data;
    },
    enabled: !!query && query.trim().length > 0,
  });
};

export const useSearchTeacher = (query: string, courseId: number) => {
  return useQuery({
    queryKey: ["searchTeachers", query, courseId],
    queryFn: async () => {
      const safeQuery = query || "";
      if (!safeQuery.trim()) {
        return [];
      }
      const response = await api.get(
        `/teacher/create/${courseId}/search/teachers`,
        {
          params: { q: safeQuery },
        }
      );
      return response.data;
    },
    enabled: !!query && query.trim().length > 0,
  });
};

// Course Management
export const useAddStudentToCourse = () => {
  return useMutation({
    mutationFn: async ({
      courseId,
      studentId,
    }: {
      courseId: number;
      studentId: number;
    }) => {
      const response = await api.post(
        `/teacher/create/${courseId}/add/student`,
        { courseId, studentId }
      );
      return response.data;
    },
  });
};

export const useAddTeacherToCourse = () => {
  return useMutation({
    mutationFn: async ({
      courseId,
      teacherId,
    }: {
      courseId: number;
      teacherId: number;
      accessToken: string;
    }) => {
      const response = await api.post(
        `/teacher/create/${courseId}/add/teacher`,
        { courseId, teacherId }
      );
      return response.data;
    },
  });
};

// Announcements (Restricted for Teachers)
export const useGetAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => api.get('/announcements/general').then((res) => res.data),
  });
};

export const useGetAnnouncementDetails = (announcementId: number) => {
  return useQuery({
    queryKey: ['announcements', announcementId],
    queryFn: () => getAnnouncementDetails(announcementId),
    enabled: !!announcementId,
  });
};

// Polls (Restricted for Teachers)
export const useRespondToPoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { pollId: number; optionId: number }) => {
      const response = await api.post('/polls/respond', data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['pollResponses', response.pollId] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

// Comments (Restricted for Teachers)
export const useGetComments = (type: string, targetId: number) => {
  return useQuery({
    queryKey: ['comments', type, targetId],
    queryFn: () => fetchComments(type, targetId),
    enabled: !!targetId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { type: string; targetId: number; content: string }) => {
      const response = await createComment(data.type, data.targetId, data.content);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.type, variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.targetId] });
    },
  });
};

// Socket Integration
export const useAnnouncementSocket = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    socket.emit('join', 'generalAnnouncements');
    socket.on('newAnnouncement', (announcement) => {
      queryClient.setQueryData(['announcements'], (oldData: any) => {
        return oldData ? [announcement, ...oldData] : [announcement];
      });
    });
    socket.on('updateAnnouncement', (announcement) => {
      queryClient.setQueryData(['announcement', announcement.announcement_id], announcement);
    });
    socket.on('deleteAnnouncement', ({ announcementId }) => {
      queryClient.setQueryData(['announcements'], (oldData: any) => {
        return oldData?.filter((a: any) => a.announcement_id !== announcementId);
      });
    });
    socket.on('newPoll', (poll) => {
      queryClient.setQueryData(['announcement', poll.general_announcement_id], (oldData: any) => ({
        ...oldData,
        poll,
      }));
    });
    socket.on('pollResponse', (response) => {
      queryClient.invalidateQueries({ queryKey: ['pollResponses', response.pollId] });
    });
    socket.on('newComment', (comment) => {
      queryClient.setQueryData(['comments', comment.type, comment.targetId], (oldData: any) => {
        return oldData ? [...oldData, comment] : [comment];
      });
      queryClient.setQueryData(['announcement', comment.targetId], (oldData: any) => ({
        ...oldData,
        _count: { ...oldData._count, comments: (oldData._count?.comments || 0) + 1 },
      }));
    });
    return () => {
      socket.off('newAnnouncement');
      socket.off('updateAnnouncement');
      socket.off('deleteAnnouncement');
      socket.off('newPoll');
      socket.off('pollResponse');
      socket.off('newComment');
    };
  }, [queryClient]);
};

export const useGetPollResponses = (pollId: number) => {
  return useQuery({
    queryKey: ['pollResponses', pollId],
    queryFn: () => getPollResponses(pollId),
    enabled: !!pollId,
  });
};