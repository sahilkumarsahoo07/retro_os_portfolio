import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: String,
    tech: String,
    link: String,
    order: Number,
});

const GallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    order: Number,
});

const MessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: true },
});

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true },
});

const ExperienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
});

export const ProjectModel = mongoose.models["Project"] || mongoose.model("Project", ProjectSchema);
export const GalleryModel = mongoose.models["Gallery"] || mongoose.model("Gallery", GallerySchema);
export const MessageModel = mongoose.models["Message"] || mongoose.model("Message", MessageSchema);
export const ProfileModel = mongoose.models["Profile"] || mongoose.model("Profile", ProfileSchema);
export const SkillModel = mongoose.models["Skill"] || mongoose.model("Skill", SkillSchema);
export const ExperienceModel = mongoose.models["Experience"] || mongoose.model("Experience", ExperienceSchema);
