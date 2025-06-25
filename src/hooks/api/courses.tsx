// hooks/api/courses.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
} from "@/utils/api/";

export const useTeacherCourses = () => {
  return useQuery({
    queryKey: ["teacherCourses"],
    queryFn: async () => {
      const response = await api.get("/courses/mine");
      return response.data;
    },
  });
};

export const useGetCourseDetails = (courseId: number) => {
  return useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: () => getCourseDetails(courseId),
    enabled: !!courseId,
  });
};

export const useGetCoursePersons = (courseId: number) => {
  return useQuery({
    queryKey: ["coursePersons", courseId],
    queryFn: () => getCoursePersons(courseId),
    enabled: !!courseId,
  });
};

export const useGetCourseContents = (courseId: number) => {
  return useQuery({
    queryKey: ["courseContents", courseId],
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
      queryClient.invalidateQueries({
        queryKey: ["courseContents", variables.courseId],
      });
    },
  });
};

export const useGetCourseRevisionQuestions = (courseId: number) => {
  return useQuery({
    queryKey: ["revisionQuestions", courseId],
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
      queryClient.invalidateQueries({
        queryKey: ["revisionQuestions", variables.courseId],
      });
    },
  });
};

export const useDeleteCourseContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseId: number; contentId: number }) =>
      api.delete(`/teacher/courses/${data.courseId}/content/${data.contentId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courseContents", variables.courseId],
      });
      // Stay on the same page
    },
  });
};

export const useDeleteRevisionQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { courseId: number; questionId: number }) =>
      api.delete(
        `/teacher/courses/${data.courseId}/revision-questions/${data.questionId}`
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["revisionQuestions", variables.courseId],
      });
      // Stay on the same page
    },
  });
};

export const useGetCourseAssignments = (courseId: number) => {
  return useQuery({
    queryKey: ["courseAssignments", courseId],
    queryFn: () => getCourseAssignments(courseId),
    enabled: !!courseId,
  });
};

export const useGetAssignmentDetails = (assignmentId) => {
  return useQuery({
    queryKey: ["assignmentDetails", assignmentId],
    queryFn: () =>
      api
        .get(`/teacher/assignments/${assignmentId}/details`)
        .then((res) => res.data), // Updated endpoint
    enabled: !!assignmentId,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, title, description, due_date, attachments }) =>
      api.post(`/teacher/courses/${courseId}/assignments`, {
        courseId,
        title,
        description,
        due_date,
        attachments,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courseAssignments", variables.courseId],
      });
    },
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, title, description, due_date, attachments }) =>
      api.put(`/teacher/assignments/${assignmentId}`, {
        assignmentId,
        title,
        description,
        due_date,
        attachments,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courseAssignments", variables.courseId],
      }); // Adjust if courseId is needed
      queryClient.invalidateQueries({
        queryKey: ["assignmentDetails", variables.assignmentId],
      });
    },
  });
};

export const useDeleteAssignment = (assignmentId, courseId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api
        .delete(`/teacher/assignments/${assignmentId}`)
        .then((res) => res.data),
    onSuccess: () => {
      // Invalidate the assignment details and course assignments queries
      queryClient.invalidateQueries({
        queryKey: ["assignmentDetails", assignmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["courseAssignments", courseId],
      });
    },
    onError: (error) => {
      console.error("Failed to delete assignment:", error);
    },
  });
};

export const useGetCourseAnnouncements = (courseId: number) => {
  return useQuery({
    queryKey: ["courseAnnouncements", courseId],
    queryFn: () => getCourseAnnouncements(courseId),
    enabled: !!courseId,
  });
};


export const useGetUpcomingDeadlines = (role: string) => {
  return useQuery({
    queryKey: ["upcomingDeadlines"],
    queryFn: async () => {
      const response = await api.get(`/${role.toLowerCase()}/deadlines/upcoming`)
  return response.data},
  });
};
// export const useGetUpcomingDeadlines = (role: string, userId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: () =>
//       api.get(`/${role.toLowerCase()}/deadlines/upcoming`, { params: { userId } }).then((res) => res.data),
//     onSuccess: (data) => {
//       // queryClient.setQueryData(['upcomingDeadlines', role, userId], data);
//     },
//     onError: (error) => {
//       console.error(`Failed to fetch upcoming deadlines for ${role}:`, error);
//     },
//   });
// };