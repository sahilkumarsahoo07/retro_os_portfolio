import { useQuery } from "@tanstack/react-query";
import { Achievement } from "@shared/schema";

export function useAchievements() {
    return useQuery<Achievement[]>({
        queryKey: ["/api/achievements"],
        queryFn: async () => {
            const res = await fetch("/api/achievements");
            if (!res.ok) throw new Error("Failed to fetch achievements");
            return res.json();
        },
    });
}
