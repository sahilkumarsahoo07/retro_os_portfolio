import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useExperience() {
    return useQuery({
        queryKey: [api.experience.list.path],
        queryFn: async () => {
            const res = await fetch(api.experience.list.path, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch experience");
            return res.json();
        },
    });
}
