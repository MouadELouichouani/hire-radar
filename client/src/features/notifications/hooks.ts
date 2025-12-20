
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api";

export function useNotifications() {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => notificationsApi.getAll(),
        refetchInterval: 30000, // Poll every 30 seconds
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => notificationsApi.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
}
