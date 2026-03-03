import { db } from "./db";
import {
  projects,
  gallery,
  messages,
  type Project,
  type GalleryImage,
  type Message,
  type InsertProject,
  type InsertGalleryImage,
  type InsertMessage
} from "@shared/schema";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getGalleryImages(): Promise<GalleryImage[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.order);
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(gallery).orderBy(gallery.order);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
