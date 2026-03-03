import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// ─── Connection ────────────────────────────────────────────────────────────────

const MONGO_URL =
    process.env.MONGO_URL ||
    process.env.MONGODB_URI ||
    process.env.MONGOURL;

if (!MONGO_URL) {
    console.error(
        "❌  No MongoDB URL found. Set MONGO_URL or MONGODB_URI in your .env file."
    );
    process.exit(1);
}

// ─── Schemas ───────────────────────────────────────────────────────────────────
// Project schema matches the existing server/models.ts shape

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    tech: { type: String },
    link: { type: String },
    order: { type: Number },
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

// ─── Models (safe for re-use if already registered) ───────────────────────────

const Project = mongoose.models["Project"] || mongoose.model("Project", ProjectSchema);
const Profile = mongoose.models["Profile"] || mongoose.model("Profile", ProfileSchema);
const Skill = mongoose.models["Skill"] || mongoose.model("Skill", SkillSchema);
const Experience = mongoose.models["Experience"] || mongoose.model("Experience", ExperienceSchema);

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const profileData = {
    name: "Sahil Kumar",
    role: "Frontend Developer",
    experience: "3 Years",
    bio: "Creative frontend developer building immersive and interactive web experiences.",
    location: "India",
};

const projectsData = [
    {
        title: "Retro OS Portfolio",
        description: "Interactive desktop-style portfolio with draggable windows and synthwave theme.",
    },
    {
        title: "Space Invaders Clone",
        description: "Web-based arcade game built using JavaScript.",
    },
    {
        title: "Music Visualizer",
        description: "Audio visualization project with dynamic animations.",
    },
];

const skillsData = [
    { name: "React", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "TypeScript", level: 75 },
    { name: "HTML", level: 95 },
    { name: "CSS / Tailwind", level: 90 },
];

const experienceData = [
    {
        title: "Frontend Developer",
        company: "Professional Experience",
        duration: "3 Years",
        description: "Built modern React applications, dashboards, and interactive UI systems.",
    },
];

// ─── Seed Function ─────────────────────────────────────────────────────────────

async function seed() {
    await mongoose.connect(MONGO_URL as string);
    console.log("✅  Connected to MongoDB\n");

    // ── Profile ──────────────────────────────────────────────────
    const existingProfile = await Profile.findOne({ name: profileData.name });
    if (!existingProfile) {
        await Profile.create(profileData);
        console.log("✅  Profile inserted");
    } else {
        console.log("⏭️   Profile already exists – skipping");
    }

    // ── Projects ─────────────────────────────────────────────────
    for (const project of projectsData) {
        const exists = await Project.findOne({ title: project.title });
        if (!exists) {
            await Project.create(project);
            console.log(`✅  Project inserted:    "${project.title}"`);
        } else {
            console.log(`⏭️   Project skipped:    "${project.title}"`);
        }
    }

    // ── Skills ───────────────────────────────────────────────────
    for (const skill of skillsData) {
        const exists = await Skill.findOne({ name: skill.name });
        if (!exists) {
            await Skill.create(skill);
            console.log(`✅  Skill inserted:      "${skill.name}" (${skill.level}%)`);
        } else {
            console.log(`⏭️   Skill skipped:      "${skill.name}"`);
        }
    }

    // ── Experience ───────────────────────────────────────────────
    for (const exp of experienceData) {
        const exists = await Experience.findOne({ title: exp.title, company: exp.company });
        if (!exists) {
            await Experience.create(exp);
            console.log(`✅  Experience inserted: "${exp.title}" @ ${exp.company}`);
        } else {
            console.log(`⏭️   Experience skipped: "${exp.title}"`);
        }
    }

    await mongoose.disconnect();
    console.log("\n🎉  Seeding complete! Connection closed.");
}

seed().catch((err) => {
    console.error("❌  Seeding failed:", err);
    mongoose.disconnect();
    process.exit(1);
});
