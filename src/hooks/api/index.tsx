import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  fetchTeacherCourses,
  createCourse,
  fetchGeneralAnnouncements,
  fetchCourseAnnouncements,
  createCourseAnnouncement,
  fetchComments,
  createComment,
  fetchPollResponses,
  respondToPoll,
  api,
} from "@/utils/api";

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
      accessToken,
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

export const useGeneralAnnouncements = (accessToken: string | null) => {
  return useQuery({
    queryKey: ["generalAnnouncements"],
    queryFn: () => fetchGeneralAnnouncements(),
    enabled: !!accessToken,
  });
};

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
      accessToken,
      data,
    }: {
      accessToken: string;
      data: { courseId: number; title: string; content: string };
    }) => createCourseAnnouncement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courseAnnouncements", variables.data.courseId],
      });
    },
  });
};

export const useComments = (
  accessToken: string | null,
  type: string,
  targetId: number
) => {
  return useQuery({
    queryKey: ["comments", type, targetId],
    queryFn: () => fetchComments(type, targetId),
    enabled: !!accessToken && !!type && !!targetId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accessToken,
      data,
    }: {
      accessToken: string;
      data: { type: string; targetId: number; content: string };
    }) => createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.data.type, variables.data.targetId],
      });
    },
  });
};

export const usePollResponses = (
  accessToken: string | null,
  pollId: number
) => {
  return useQuery({
    queryKey: ["pollResponses", pollId],
    queryFn: () => fetchPollResponses(pollId),
    enabled: !!accessToken && !!pollId,
  });
};

export const useRespondToPoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accessToken,
      pollId,
      optionId,
    }: {
      accessToken: string;
      pollId: number;
      optionId: number;
    }) => respondToPoll(pollId, optionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pollResponses", variables.pollId],
      });
    },
  });
};

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

// Search for teachers
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

// Add student to course
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

// Add teacher to course
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
