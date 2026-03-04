import {
  ProjectModel,
  GalleryModel,
  MessageModel,
  ProfileModel,
  SkillModel,
  ExperienceModel,
  CertificationModel,
  AchievementModel
} from "./models";
import {
  type Project,
  type GalleryImage,
  type Message,
  type InsertProject,
  type InsertGalleryImage,
  type InsertMessage,
  type Profile,
  type Skill,
  type Experience,
  type Certification,
  type Achievement
} from "@shared/schema";


export interface IStorage {
  getProjects(): Promise<Project[]>;
  getGalleryImages(): Promise<GalleryImage[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getProfile(): Promise<Profile | null>;
  getSkills(): Promise<Skill[]>;
  getExperience(): Promise<Experience[]>;
  getCertifications(): Promise<Certification[]>;
  getAchievements(): Promise<Achievement[]>;
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

  async getProfile(): Promise<Profile | null> {
    const profile = await ProfileModel.findOne();
    return profile ? profile.toObject() : null;
  }

  async getSkills(): Promise<Skill[]> {
    const skills = await SkillModel.find();
    return skills.map(s => s.toObject());
  }

  async getExperience(): Promise<Experience[]> {
    const exp = await ExperienceModel.find();
    return exp.map(e => e.toObject());
  }

  async getCertifications(): Promise<Certification[]> {
    const certs = await CertificationModel.find();
    return certs.map(c => c.toObject());
  }

  async getAchievements(): Promise<Achievement[]> {
    const achs = await AchievementModel.find();
    return achs.map(a => a.toObject());
  }
}

export const storage = new MongoStorage();

