import { useQuery } from "@tanstack/react-query";
import { Certification } from "@shared/schema";

import { API_BASE_URL } from "../lib/queryClient";

export function useCertifications() {
    return useQuery<Certification[]>({
        queryKey: ["/api/certifications"],
        queryFn: async () => {
            const res = await fetch(API_BASE_URL + "/api/certifications");
            if (!res.ok) throw new Error("Failed to fetch certifications");
            return res.json();
        },
    });
}
