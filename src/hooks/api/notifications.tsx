import { api } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications", {
        params: { page: 1, limit: 20 },
      });
      return response.data;
    },
    retry: 1,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
