import { useQuery } from "@tanstack/react-query";
import { Achievement } from "@shared/schema";

import { API_BASE_URL } from "../lib/queryClient";

export function useAchievements() {
    return useQuery<Achievement[]>({
        queryKey: ["/api/achievements"],
        queryFn: async () => {
            const res = await fetch(API_BASE_URL + "/api/achievements");
            if (!res.ok) throw new Error("Failed to fetch achievements");
            return res.json();
        },
    });
}
