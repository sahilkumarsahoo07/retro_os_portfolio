import { useQuery } from "@tanstack/react-query";
import { Certification } from "@shared/schema";

export function useCertifications() {
    return useQuery<Certification[]>({
        queryKey: ["/api/certifications"],
        queryFn: async () => {
            const res = await fetch("/api/certifications");
            if (!res.ok) throw new Error("Failed to fetch certifications");
            return res.json();
        },
    });
}
