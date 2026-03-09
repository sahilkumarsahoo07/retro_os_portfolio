import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

import { API_BASE_URL } from "../lib/queryClient";

export function useSkills() {
    return useQuery({
        queryKey: [api.skills.list.path],
        queryFn: async () => {
            const res = await fetch(API_BASE_URL + api.skills.list.path);
            if (!res.ok) throw new Error("Failed to fetch skills");
            return res.json();
        },
    });
}
