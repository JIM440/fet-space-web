// hooks/api/courses.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCourseDetails,
  getCoursePersons,
  getCourseContents,
  getCourseAssignments,
  getCourseRevisionQuestions,
  getCourseAnnouncements,
  uploadCourseContent,
  uploadRevisionQuestions,
  api,
} from '@/utils/api/';

export const useTeacherCourses = () => {
  return useQuery({
    queryKey: ['teacherCourses'],
    queryFn: async () => {
      const response = await api.get('/courses/mine');
      return response.data;
    },
  });
};

export const useGetCourseDetails = (courseId: number) => {
  return useQuery({
    queryKey: ['courseDetails', courseId],
    queryFn: () => getCourseDetails(courseId),
    enabled: !!courseId,
  });
};

export const useGetCoursePersons = (courseId: number) => {
  return useQuery({
    queryKey: ['coursePersons', courseId],
    queryFn: () => getCoursePersons(courseId),
    enabled: !!courseId,
  });
};

export const useGetCourseContents = (courseId: number) => {
  return useQuery({
    queryKey: ['courseContents', courseId],
    queryFn: () => getCourseContents(courseId),
    enabled: !!courseId,
  });
};

export const useUploadCourseContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseId: number; file: File }) =>
      uploadCourseContent(data.courseId, data.file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courseContents', variables.courseId] });
    },
  });
};

export const useGetCourseRevisionQuestions = (courseId: number) => {
  return useQuery({
    queryKey: ['revisionQuestions', courseId],
    queryFn: () => getCourseRevisionQuestions(courseId),
    enabled: !!courseId,
  });
};

export const useUploadRevisionQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseId: number; file: File }) =>
      uploadRevisionQuestions(data.courseId, data.file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['revisionQuestions', variables.courseId] });
    },
  });
};

export const useGetCourseAssignments = (courseId: number) => {
  return useQuery({
    queryKey: ['courseAssignments', courseId],
    queryFn: () => getCourseAssignments(courseId),
    enabled: !!courseId,
  });
};

export const useGetCourseAnnouncements = (courseId: number) => {
  return useQuery({
    queryKey: ['courseAnnouncements', courseId],
    queryFn: () => getCourseAnnouncements(courseId),
    enabled: !!courseId,
  });
};