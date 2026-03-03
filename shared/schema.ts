import { z } from "zod";
import mongoose from "mongoose";

// Zod Schemas for validation
export const insertProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  tech: z.string().optional(),
  link: z.string().optional(),
  order: z.number().optional(),
});

export const insertGallerySchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  order: z.number().optional(),
});

export const insertMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  content: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string(),
  role: z.string(),
  experience: z.string(),
  bio: z.string(),
  location: z.string(),
});

export const skillSchema = z.object({
  name: z.string(),
  level: z.number(),
});

export const experienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  duration: z.string(),
  description: z.string(),
});

// Types
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = InsertProject & { id: string };

export type InsertGalleryImage = z.infer<typeof insertGallerySchema>;
export type GalleryImage = InsertGalleryImage & { id: string };

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = InsertMessage & { id: string; createdAt: Date };

export type Profile = z.infer<typeof profileSchema> & { id: string };
export type Skill = z.infer<typeof skillSchema> & { id: string };
export type Experience = z.infer<typeof experienceSchema> & { id: string };
