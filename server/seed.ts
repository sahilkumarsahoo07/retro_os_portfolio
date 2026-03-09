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
    name: "Sahil Kumar Sahoo",
    title: "Frontend & GenAI Developer",
    summary:
        "Frontend and GenAI Developer with 3+ years of experience architecting scalable web applications using React.js, Next.js, and modern JavaScript frameworks. Specialized in engineering AI-powered analytics platforms, multi-agent AI systems, and natural language data interfaces using LLM integrations. Proven ability to deliver enterprise dashboards, workflow automation systems, and intelligent data exploration tools that enable organizations to extract insights from complex datasets.",
    email: "sksahoo.dev@gmail.com",
    phone: "+91 8327704042",
    linkedin: "https://in.linkedin.com/in/sahil-kumar-sahoo",
    github: "https://github.com/sahilkumarsahoo07"
};

const projectsData = [
    {
        title: "Lexy AI",
        description:
            "Architected an enterprise GenAI analytics platform enabling natural language querying, automated insight generation, dataset modeling, workflow automation, and intelligent dashboard creation for enterprise data analysis.",
        technologies: [
            "React.js",
            "GenAI",
            "SQL Agents",
            "ML Agents",
            "Data Visualization"
        ],
        githubLink: "https://github.com/sahilkumarsahoo07",
        liveDemo: "https://sahilkumarwindow.netlify.app",
        order: 1
    },
    {
        title: "Multi-Agent AI Platform",
        description:
            "Designed a multi-agent AI system where distributed AI agents collaborate to generate contextual responses. Engineered a React-based conversational interface and integrated LLM APIs for agent coordination.",
        technologies: [
            "React",
            "LLM APIs",
            "Multi-Agent Architecture",
            "Conversational UI"
        ],
        githubLink: "https://github.com/sahilkumarsahoo07",
        liveDemo: "https://agent-chat-pi.vercel.app/",
        order: 2
    },
    {
        title: "Retro Windows 98 Portfolio OS",
        description:
            "An interactive portfolio designed as a fully functional Windows 98 operating system inside the browser. Features draggable windows, taskbar, file explorer, and multiple applications built using React and Framer Motion.",
        technologies: [
            "React",
            "TypeScript",
            "Framer Motion",
            "Tailwind CSS",
            "MongoDB"
        ],
        githubLink: "https://github.com/sahilkumarsahoo07/retro_os_portfolio",
        liveDemo: "https://sahilkumarwindow.netlify.app",
        order: 3
    }
];

const skillsData = [
    {
        category: "Frontend Engineering",
        skills: [
            "React.js",
            "Next.js",
            "JavaScript (ES6+)",
            "HTML5",
            "CSS3",
            "Tailwind CSS",
            "Bootstrap",
            "jQuery"
        ]
    },
    {
        category: "GenAI & AI Systems",
        skills: [
            "OpenAI API",
            "LLM Integration",
            "AI Agents",
            "Multi-Agent Architectures",
            "Prompt Engineering",
            "AI Chat Interfaces"
        ]
    },
    {
        category: "Architecture & Performance",
        skills: [
            "Component-Based Architecture",
            "Responsive Design",
            "Cross-Browser Compatibility",
            "Code Splitting",
            "Lazy Loading",
            "Performance Optimization"
        ]
    },
    {
        category: "Analytics & Visualization",
        skills: [
            "Interactive Dashboards",
            "Data Visualization",
            "Google Charts",
            "Analytics Reporting"
        ]
    },
    {
        category: "Backend & Data Integration",
        skills: [
            "REST APIs",
            "JSON APIs",
            "Python API Integration",
            "Database Connectivity"
        ]
    },
    {
        category: "Tools & Workflow",
        skills: [
            "Git",
            "GitHub",
            "Agile Development",
            "NPM",
            "Vercel"
        ]
    }
];

const experienceData = [
    {
        company: "Phenom Cloud India Pvt Ltd",
        role: "Software Design Engineer – I",
        duration: "May 2023 – Present",
        description:
            "Spearheaded development of enterprise analytics dashboards for global clients. Optimized performance by 30% through code splitting and architecture improvements. Architected Lexy AI and engineered AI-powered SQL/ML agents. Orchestrated data modeling pipelines and automated workflow pipelines."
    },
    {
        company: "Phenom Cloud India Pvt Ltd",
        role: "Software Design Engineer – Trainee",
        duration: "2022 - 2023",
        description:
            "Engineered responsive learner and manager analytics dashboards using JavaScript, HTML5, CSS3, and Bootstrap. Integrated Google Charts for interactive reporting and enhanced UX through optimized frontend architecture."
    }
];

const certificationsData = [
    {
        name: "Java Full Stack Skills & Training",
        issuer: "QSpiders",
        year: "2022"
    },
    {
        name: "Bachelor of Science (Physics)",
        issuer: "Utkal University",
        year: "2021"
    }
];

const achievementsData = [
    {
        title: "Top Performer Award (2024)",
        description:
            "Received for delivering high-impact enterprise frontend solutions at Phenom Cloud.",
        date: "2024"
    },
    {
        title: "UI/UX Innovation",
        description:
            "Designed custom React and CSS carousel animations improving UI engagement.",
        date: "2024"
    },
    {
        title: "Mentorship",
        description:
            "Mentored junior developers and promoted scalable frontend engineering practices.",
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
