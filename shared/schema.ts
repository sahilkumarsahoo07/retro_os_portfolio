import { z } from "zod";
import mongoose from "mongoose";

// Zod Schemas for validation
export const insertProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()),
  githubLink: z.string().optional(),
  liveDemo: z.string().optional(),
  image: z.string().optional(),
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
  title: z.string(),
  summary: z.string(),
  email: z.string(),
  phone: z.string(),
  linkedin: z.string(),
  github: z.string(),
});

export const skillSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
});

export const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  duration: z.string(),
  description: z.string(),
});

export const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  year: z.string(),
});

export const achievementSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
});

// Types
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = InsertProject & { _id: string };

export type InsertGalleryImage = z.infer<typeof insertGallerySchema>;
export type GalleryImage = InsertGalleryImage & { _id: string };

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = InsertMessage & { _id: string; createdAt: Date };

export type Profile = z.infer<typeof profileSchema> & { _id: string };
export type Skill = z.infer<typeof skillSchema> & { _id: string };
export type Experience = z.infer<typeof experienceSchema> & { _id: string };
export type Certification = z.infer<typeof certificationSchema> & { _id: string };
export type Achievement = z.infer<typeof achievementSchema> & { _id: string };
