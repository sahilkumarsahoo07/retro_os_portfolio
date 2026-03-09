import { useQuery } from "@tanstack/react-query";
import { api, type GalleryResponse } from "@shared/routes";

import { API_BASE_URL } from "../lib/queryClient";

export function useGallery() {
  return useQuery({
    queryKey: [api.gallery.list.path],
    queryFn: async () => {
      const res = await fetch(API_BASE_URL + api.gallery.list.path, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch gallery");
      }
      const data = await res.json();
      return api.gallery.list.responses[200].parse(data);
    },
  });
}
