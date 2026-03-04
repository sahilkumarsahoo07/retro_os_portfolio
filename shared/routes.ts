import { z } from 'zod';
import {
  insertProjectSchema,
  insertGallerySchema,
  insertMessageSchema,
  profileSchema,
  skillSchema,
  experienceSchema,
  certificationSchema,
  achievementSchema,
  type Project,
  type GalleryImage,
  type Message,
  type Profile,
  type Skill,
  type Experience,
  type Certification,
  type Achievement,
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
        200: z.custom<Profile>().nullable(),
      },
    },
  },
  skills: {
    list: {
      method: 'GET' as const,
      path: '/api/skills' as const,
      responses: {
        200: z.array(z.custom<Skill>()),
      },
    },
  },
  experience: {
    list: {
      method: 'GET' as const,
      path: '/api/experience' as const,
      responses: {
        200: z.array(z.custom<Experience>()),
      },
    },
  },
  certifications: {
    list: {
      method: 'GET' as const,
      path: '/api/certifications' as const,
      responses: {
        200: z.array(z.custom<Certification>()),
      },
    },
  },
  achievements: {
    list: {
      method: 'GET' as const,
      path: '/api/achievements' as const,
      responses: {
        200: z.array(z.custom<Achievement>()),
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
export type CertificationsResponse = z.infer<typeof api.certifications.list.responses[200]>;
export type AchievementsResponse = z.infer<typeof api.achievements.list.responses[200]>;
