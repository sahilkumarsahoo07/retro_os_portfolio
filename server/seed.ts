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
    technologies: [String],
    githubLink: String,
    liveDemo: String,
    image: String,
    order: Number,
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

// ─── Models ───────────────────────────
const Project = mongoose.models["Project"] || mongoose.model("Project", ProjectSchema);
const Profile = mongoose.models["Profile"] || mongoose.model("Profile", ProfileSchema);
const Skill = mongoose.models["Skill"] || mongoose.model("Skill", SkillSchema);
const Experience = mongoose.models["Experience"] || mongoose.model("Experience", ExperienceSchema);
const Certification = mongoose.models["Certification"] || mongoose.model("Certification", CertificationSchema);
const Achievement = mongoose.models["Achievement"] || mongoose.model("Achievement", AchievementSchema);

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const profileData = {
    name: "Sahil Kumar",
    title: "Full Stack Developer | React | Node.js | Generative AI",
    summary:
        "Full Stack Developer with around 3 years of experience building scalable web applications using React, Node.js, and modern JavaScript frameworks. Passionate about creating interactive UI/UX experiences and exploring Generative AI technologies. Currently building unique projects such as a Windows 98 style portfolio OS and AI-powered developer tools.",
    email: "sahilkumarsahoo001@gmail.com",
    phone: "+91 8327704042",
    linkedin: "https://in.linkedin.com/in/sahil-kumar-sahoo",
    github: "https://github.com/sahilkumarsahoo07"
};

const projectsData = [
    {
        title: "Retro Windows 98 Portfolio OS",
        description:
            "An interactive portfolio designed as a fully functional Windows 98 operating system inside the browser. Features draggable windows, taskbar, file explorer, recycle bin, and multiple applications built using React and Framer Motion.",
        technologies: [
            "React",
            "TypeScript",
            "Framer Motion",
            "Node.js",
            "MongoDB",
            "Tailwind CSS"
        ],
        githubLink: "https://github.com/sahilkumarsahoo07/retro_os_portfolio",
        liveDemo: "https://your-portfolio-link.com",
        order: 1
    },
    {
        title: "AI Job Scraper Agent",
        description:
            "An AI-powered job search automation tool that scans multiple job platforms, filters relevant opportunities, and summarizes job descriptions using LLMs.",
        technologies: [
            "Node.js",
            "OpenAI",
            "Python",
            "Web Scraping",
            "Automation"
        ],
        githubLink: "https://github.com/sahilkumarsahoo07",
        liveDemo: "",
        order: 2
    },
    {
        title: "AI Assistant Platform",
        description:
            "A multi-agent AI assistant platform where users can interact with different AI agents for coding help, research, and automation.",
        technologies: [
            "Next.js",
            "LangChain",
            "OpenAI",
            "Vector Databases",
            "TypeScript"
        ],
        githubLink: "https://github.com/sahilkumarsahoo07",
        liveDemo: "",
        order: 3
    }
];

const skillsData = [
    {
        category: "Frontend",
        skills: [
            "React",
            "Next.js",
            "JavaScript",
            "TypeScript",
            "Tailwind CSS",
            "Redux",
            "Framer Motion"
        ]
    },
    {
        category: "Backend",
        skills: [
            "Node.js",
            "Express.js",
            "MongoDB",
            "REST APIs",
            "GraphQL"
        ]
    },
    {
        category: "AI / Generative AI",
        skills: [
            "OpenAI APIs",
            "LangChain",
            "Prompt Engineering",
            "Vector Databases"
        ]
    },
    {
        category: "Tools & DevOps",
        skills: [
            "Git",
            "Docker",
            "AWS",
            "Linux",
            "Vercel"
        ]
    }
];

const experienceData = [
    {
        company: "Phenom Cloud",
        role: "Software Design Engineer - 1",
        duration: "2023 - Present",
        description:
            "Working on building modern web applications using React and Node.js. Developed multiple UI components, optimized performance, and collaborated with backend teams to deliver scalable products."
    }
];

const certificationsData = [
    {
        name: "Full Stack Web Development",
        issuer: "Coursera",
        year: "2020"
    },
    {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        year: "2021"
    }
];

const achievementsData = [
    {
        title: "Built a Full Windows 98 Style Portfolio OS",
        description:
            "Created a unique interactive portfolio designed as a Windows 98 operating system using React and TypeScript.",
        date: "2025"
    },
    {
        title: "AI Developer Projects",
        description:
            "Developed several AI-based tools using OpenAI APIs and automation workflows.",
        date: "2024"
    }
];

// ─── Seed Function ─────────────────────────────────────────────────────────────

async function seed() {
    await mongoose.connect(MONGO_URL as string);
    console.log("✅  Connected to MongoDB\n");

    // Clear existing data to avoid duplicates with old formats
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Certification.deleteMany({});
    await Achievement.deleteMany({});
    console.log("🧹  Existing data cleared\n");

    // Profile
    await Profile.create(profileData);
    console.log("✅  Profile inserted");

    // Projects
    for (const project of projectsData) {
        await Project.create(project);
        console.log(`✅  Project inserted:    "${project.title}"`);
    }

    // Skills
    for (const skill of skillsData) {
        await Skill.create(skill);
        console.log(`✅  Skill inserted:      "${skill.category}"`);
    }

    // Experience
    for (const exp of experienceData) {
        await Experience.create(exp);
        console.log(`✅  Experience inserted: "${exp.role}" @ ${exp.company}`);
    }

    // Certifications
    for (const cert of certificationsData) {
        await Certification.create(cert);
        console.log(`✅  Cert inserted:       "${cert.name}"`);
    }

    // Achievements
    for (const ach of achievementsData) {
        await Achievement.create(ach);
        console.log(`✅  Achievement inserted: "${ach.title}"`);
    }

    await mongoose.disconnect();
    console.log("\n🎉  Seeding complete! Connection closed.");
}

seed().catch((err) => {
    console.error("❌  Seeding failed:", err);
    mongoose.disconnect();
    process.exit(1);
});
