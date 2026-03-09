import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

import { API_BASE_URL } from "../lib/queryClient";

export function useExperience() {
    return useQuery({
        queryKey: [api.experience.list.path],
        queryFn: async () => {
            const res = await fetch(API_BASE_URL + api.experience.list.path);
            if (!res.ok) throw new Error("Failed to fetch experience");
            return res.json();
        },
    });
}
