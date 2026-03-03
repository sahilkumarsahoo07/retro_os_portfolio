import { z } from 'zod';
import {
  insertProjectSchema,
  insertGallerySchema,
  insertMessageSchema,
  profileSchema,
  skillSchema,
  experienceSchema,
  type Project,
  type GalleryImage,
  type Message,
  type Profile,
  type Skill,
  type Experience,
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects' as const,
      responses: {
        200: z.array(z.custom<Project>()),
      },
    },
  },
  gallery: {
    list: {
      method: 'GET' as const,
      path: '/api/gallery' as const,
      responses: {
        200: z.array(z.custom<GalleryImage>()),
      },
    },
  },
  messages: {
    create: {
      method: 'POST' as const,
      path: '/api/messages' as const,
      input: insertMessageSchema,
      responses: {
        201: z.custom<Message>(),
        400: errorSchemas.validation,
      },
    },
  },
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile' as const,
      responses: {
        200: profileSchema.extend({ id: z.string() }).nullable(),
      },
    },
  },
  skills: {
    list: {
      method: 'GET' as const,
      path: '/api/skills' as const,
      responses: {
        200: z.array(skillSchema.extend({ id: z.string() })),
      },
    },
  },
  experience: {
    list: {
      method: 'GET' as const,
      path: '/api/experience' as const,
      responses: {
        200: z.array(experienceSchema.extend({ id: z.string() })),
      },
    },
  },
};


export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ProjectResponse = z.infer<typeof api.projects.list.responses[200]>;
export type GalleryResponse = z.infer<typeof api.gallery.list.responses[200]>;
export type MessageInput = z.infer<typeof api.messages.create.input>;
export type MessageResponse = z.infer<typeof api.messages.create.responses[201]>;
export type ProfileResponse = z.infer<typeof api.profile.get.responses[200]>;
export type SkillsResponse = z.infer<typeof api.skills.list.responses[200]>;
export type ExperienceResponse = z.infer<typeof api.experience.list.responses[200]>;
