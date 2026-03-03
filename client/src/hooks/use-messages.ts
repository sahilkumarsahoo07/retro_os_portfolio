import { useMutation } from "@tanstack/react-query";
import { api, type MessageInput } from "@shared/routes";

export function useCreateMessage() {
  return useMutation({
    mutationFn: async (data: MessageInput) => {
      const validated = api.messages.create.input.parse(data);
      const res = await fetch(api.messages.create.path, {
        method: api.messages.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation failed");
        }
        throw new Error("Failed to send message");
      }
      
      const responseData = await res.json();
      return api.messages.create.responses[201].parse(responseData);
    },
  });
}
