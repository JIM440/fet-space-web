import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchComments, api } from "@/utils/api";
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { createComment } from "@/utils/api/announcementApi";

// Initialize Socket.IO client
const socket: Socket = io('http://localhost:8989');

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
      const res_data = await createComment(data.type, data.targetId, data.content);
      return res_data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.type, variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.targetId] });
    },
    onError: (error) => {
      console.error("Failed to create comment:", error);
    },
  });
};

export const useCommentSocket = (targetId: number) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (targetId) {
      socket.emit('join', `commentRoom_${targetId}`);
      socket.on('newComment', (comment) => {
        if (comment.targetId === targetId) {
          queryClient.setQueryData(['comments', comment.type, comment.targetId], (oldData: any) => {
            return oldData ? [...oldData, comment] : [comment];
          });
          queryClient.setQueryData(['announcement', targetId], (oldData: any) => ({
            ...oldData,
            _count: { ...oldData._count, comments: (oldData._count?.comments || 0) + 1 },
          }));
        }
      });
      return () => {
        socket.off('newComment');
        socket.emit('leave', `commentRoom_${targetId}`);
      };
    }
  }, [targetId, queryClient]);
};