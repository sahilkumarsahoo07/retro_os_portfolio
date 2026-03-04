import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { ProjectModel, GalleryModel, ProfileModel, SkillModel, ExperienceModel } from "./models";


async function seedDatabase() {
  const existingProjects = await storage.getProjects();
  if (existingProjects.length === 0) {
    await ProjectModel.insertMany([
      {
        title: "Retro OS Portfolio",
        description: "A Windows 95 inspired personal website built with React and Tailwind CSS.",
        tech: "React, TypeScript, Tailwind",
        link: "https://github.com",
        order: 1
      },
      {
        title: "Space Invaders Clone",
        description: "A web-based clone of the classic arcade game Space Invaders.",
        tech: "HTML5 Canvas, JS",
        link: "https://github.com",
        order: 2
      },
      {
        title: "Music Visualizer",
        description: "Audio visualization tool using the Web Audio API.",
        tech: "Web Audio API, React",
        link: "https://github.com",
        order: 3
      }
    ]);
  }

  const existingGallery = await storage.getGalleryImages();
  if (existingGallery.length === 0) {
    await GalleryModel.insertMany([
      { title: "Vaporwave sunset", url: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=2070", order: 1 },
      { title: "Retro arcade", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070", order: 2 },
      { title: "Cyberpunk city", url: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2070", order: 3 },
      { title: "Old computer", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070", order: 4 },
    ]);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed initial data
  seedDatabase().catch(console.error);

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/gallery", async (_req, res) => {
    const images = await storage.getGalleryImages();
    res.json(images);
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(data);
      res.json(message);
    } catch (e) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // ── Profile ──────────────────────────────────────────────────────────────────
  app.get(api.profile.get.path, async (_req, res) => {
    const profile = await ProfileModel.findOne().lean();
    res.status(200).json(profile ?? null);
  });

  // ── Skills ───────────────────────────────────────────────────────────────────
  app.get(api.skills.list.path, async (_req, res) => {
    const skills = await SkillModel.find().lean();
    res.status(200).json(skills);
  });

  // ── Experience ───────────────────────────────────────────────────────────────
  app.get(api.experience.list.path, async (_req, res) => {
    const experience = await ExperienceModel.find().lean();
    res.status(200).json(experience);
  });

  return httpServer;
}
