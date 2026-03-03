import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useSkills() {
    return useQuery({
        queryKey: [api.skills.list.path],
        queryFn: async () => {
            const res = await fetch(api.skills.list.path, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch skills");
            return res.json();
        },
    });
}
