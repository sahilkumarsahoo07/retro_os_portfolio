import {
  ProjectModel,
  GalleryModel,
  MessageModel
} from "./models";
import {
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

export class MongoStorage implements IStorage {
  async getProjects(): Promise<Project[]> {
    const projects = await ProjectModel.find().sort({ order: 1 });
    return projects.map(p => p.toObject());
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    const images = await GalleryModel.find().sort({ order: 1 });
    return images.map(img => img.toObject());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage = await MessageModel.create(message);
    return newMessage.toObject();
  }
}

export const storage = new MongoStorage();

