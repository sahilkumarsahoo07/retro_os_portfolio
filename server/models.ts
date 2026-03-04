import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [String],
    githubLink: String,
    liveDemo: String,
    image: String,
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
    title: { type: String, required: true },
    summary: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
});

const SkillSchema = new mongoose.Schema({
    category: { type: String, required: true },
    skills: [String],
});

const ExperienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
});

const CertificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    year: { type: String, required: true },
});

const AchievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
});

export const ProjectModel = mongoose.models["Project"] || mongoose.model("Project", ProjectSchema);
export const GalleryModel = mongoose.models["Gallery"] || mongoose.model("Gallery", GallerySchema);
export const MessageModel = mongoose.models["Message"] || mongoose.model("Message", MessageSchema);
export const ProfileModel = mongoose.models["Profile"] || mongoose.model("Profile", ProfileSchema);
export const SkillModel = mongoose.models["Skill"] || mongoose.model("Skill", SkillSchema);
export const ExperienceModel = mongoose.models["Experience"] || mongoose.model("Experience", ExperienceSchema);
export const CertificationModel = mongoose.models["Certification"] || mongoose.model("Certification", CertificationSchema);
export const AchievementModel = mongoose.models["Achievement"] || mongoose.model("Achievement", AchievementSchema);
