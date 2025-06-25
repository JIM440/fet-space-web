import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';
import {
  createCourseAnnouncement,
  getCourseAnnouncements,
  getCourseAnnouncementDetails,
} from '@/utils/api/courseAnnouncementApi';

const socket: Socket = io('http://localhost:8989');

export const useCreateCourseAnnouncement = (courseId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      courseId: number;
      title: string;
      content: string;
      is_poll?: boolean;
      poll?: {
        allow_multiple_answers: boolean;
        type: string;
        options: string[];
      };
      attachments?: string[];
    }) => {
      const response = await createCourseAnnouncement(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['courseAnnouncements', courseId]});
    },
  });
};

export const useCourseAnnouncements = (courseId: number, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['courseAnnouncements', courseId, page, limit],
    queryFn: () => getCourseAnnouncements(courseId, page, limit),
  });
};

export const useCourseAnnouncementDetails = (announcementId: number) => {
  return useQuery({
    queryKey: ['courseAnnouncement', announcementId],
    queryFn: () => getCourseAnnouncementDetails(announcementId),
    enabled: !!announcementId,
  });
};

export const useCourseAnnouncementSocket = (courseId: number) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    socket.emit('join', `course_${courseId}`);
    socket.on('newAnnouncement', (announcement) => {
      queryClient.setQueryData(['courseAnnouncements', courseId, 1, 10], (oldData: any) => {
        return oldData ? [announcement, ...oldData] : [announcement];
      });
    });
    socket.on('updateAnnouncement', (announcement) => {
      queryClient.setQueryData(['courseAnnouncement', announcement.announcement_id], announcement);
      queryClient.setQueryData(['courseAnnouncements', courseId, 1, 10], (oldData: any) => {
        return oldData?.map((a: any) =>
          a.announcement_id === announcement.announcement_id ? announcement : a
        );
      });
    });
    socket.on('deleteAnnouncement', ({ announcementId }) => {
      queryClient.setQueryData(['courseAnnouncements', courseId, 1, 10], (oldData: any) =>
        oldData?.filter((a: any) => a.announcement_id !== announcementId)
      );
      queryClient.removeQueries({queryKey: ['courseAnnouncement', announcementId]});
    });
    return () => {
      socket.off('newAnnouncement');
      socket.off('updateAnnouncement');
      socket.off('deleteAnnouncement');
      socket.emit('leave', `course_${courseId}`);
    };
  }, [courseId, queryClient]);
};