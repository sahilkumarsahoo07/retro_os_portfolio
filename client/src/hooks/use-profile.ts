import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

import { API_BASE_URL } from "../lib/queryClient";

export function useProfile() {
    return useQuery({
        queryKey: [api.profile.get.path],
        queryFn: async () => {
            const res = await fetch(API_BASE_URL + api.profile.get.path, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json();
        },
    });
}
