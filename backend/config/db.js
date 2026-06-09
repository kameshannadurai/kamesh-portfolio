import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Register Mongoose models
import '../models/Project.js';
import '../models/Skill.js';
import '../models/Message.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db_fallback.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isFallbackMode = false;

// Default initial data for fallback JSON database
const defaultData = {
  projects: [
    {
      _id: "p1",
      title: "NeonSpace Portfolio",
      description: "A gorgeous, high-performance portfolio template with dynamic background canvas particles, rich details modal, and a fully-functional secure admin dashboard to control items in real-time.",
      category: "Fullstack",
      tags: ["React", "Express", "Node.js", "MongoDB", "CSS Glassmorphism"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      githubUrl: "https://github.com",
      liveUrl: "https://google.com",
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: "p2",
      title: "FinTech Dashboard",
      description: "An analytics dashboard featuring live mock market data, custom charts, budgeting tools, and secure transactional simulations with modern UI components.",
      category: "Frontend",
      tags: ["React", "ChartJS", "Vite", "Vanilla CSS"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      githubUrl: "https://github.com",
      liveUrl: "https://google.com",
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: "p3",
      title: "TaskFlow Manager API",
      description: "A scalable, documented RESTful API backend handling project workflows, team collaboration, token-based authentication, and structured error handling.",
      category: "Backend",
      tags: ["Node.js", "Express", "PostgreSQL", "JWT", "Swagger"],
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
      githubUrl: "https://github.com",
      liveUrl: "",
      featured: false,
      createdAt: new Date().toISOString()
    }
  ],
  skills: [
    { _id: "s1", name: "Java", category: "Frontend", percentage: 90 },
    { _id: "s2", name: "React.js", category: "Frontend", percentage: 85 },
    { _id: "s3", name: "HTML , CSS , JS", category: "Frontend", percentage: 95 },
    { _id: "s4", name: "java , python ", category: "Backend", percentage: 80 },
    { _id: "s5", name: "Oracle databasse & MySql", category: "Database", percentage: 75 },
    { _id: "s6", name: "RESTful APIs & Integration", category: "Backend", percentage: 85 },
  
  ],
  messages: []
};

// Initialize JSON database if it doesn't exist
if (!fs.existsSync(JSON_DB_PATH)) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
}

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('\n⚠️  No MONGODB_URI found in environment variables.');
    console.warn('⚡ Starting server in FALLBACK MODE (using local JSON database: backend/data/db_fallback.json)\n');
    isFallbackMode = true;
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log('\n🟢 Connected to MongoDB Database successfully!\n');
    isFallbackMode = false;

    // Seed MongoDB collections if they are empty
    try {
      const Project = mongoose.model('Project');
      const Skill = mongoose.model('Skill');

      const projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        const cleanProjects = defaultData.projects.map(({ _id, ...p }) => p);
        await Project.insertMany(cleanProjects);
        console.log('🌱 Seeded default projects into MongoDB.');
      }

      const skillCount = await Skill.countDocuments();
      if (skillCount === 0) {
        const cleanSkills = defaultData.skills.map(({ _id, ...s }) => s);
        await Skill.insertMany(cleanSkills);
        console.log('🌱 Seeded default skills into MongoDB.');
      }
    } catch (seedErr) {
      console.warn('⚠️ Seeding MongoDB failed:', seedErr.message);
    }
  } catch (error) {
    console.error(`\n❌ MongoDB connection failed: ${error.message}`);
    console.warn('⚡ Switching to FALLBACK MODE (using local JSON database: backend/data/db_fallback.json)\n');
    isFallbackMode = true;
  }
};

export const getDbMode = () => ({
  isFallback: isFallbackMode,
  dbPath: isFallbackMode ? JSON_DB_PATH : 'MongoDB Cloud/Local'
});

// JSON Helper Functions
const readJsonDb = () => {
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON database, resetting to default...", err);
    return defaultData;
  }
};

const writeJsonDb = (data) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// Unified Database Service Abstraction
export const dbService = {
  projects: {
    find: async (query = {}) => {
      if (!isFallbackMode) {
        return mongoose.model('Project').find(query).sort({ createdAt: -1 });
      }
      let list = readJsonDb().projects;
      if (query.featured !== undefined) {
        list = list.filter(p => p.featured === query.featured);
      }
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    findById: async (id) => {
      if (!isFallbackMode) {
        return mongoose.model('Project').findById(id);
      }
      const item = readJsonDb().projects.find(p => p._id === id);
      if (!item) throw new Error("Project not found");
      return item;
    },
    create: async (data) => {
      if (!isFallbackMode) {
        return mongoose.model('Project').create(data);
      }
      const db = readJsonDb();
      const newProject = {
        _id: 'p_' + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        featured: false,
        ...data
      };
      db.projects.push(newProject);
      writeJsonDb(db);
      return newProject;
    },
    findByIdAndUpdate: async (id, data, options = {}) => {
      if (!isFallbackMode) {
        return mongoose.model('Project').findByIdAndUpdate(id, data, { new: true, ...options });
      }
      const db = readJsonDb();
      const idx = db.projects.findIndex(p => p._id === id);
      if (idx === -1) return null;
      db.projects[idx] = { ...db.projects[idx], ...data };
      writeJsonDb(db);
      return db.projects[idx];
    },
    findByIdAndDelete: async (id) => {
      if (!isFallbackMode) {
        return mongoose.model('Project').findByIdAndDelete(id);
      }
      const db = readJsonDb();
      const idx = db.projects.findIndex(p => p._id === id);
      if (idx === -1) return null;
      const deleted = db.projects.splice(idx, 1)[0];
      writeJsonDb(db);
      return deleted;
    }
  },
  skills: {
    find: async (query = {}) => {
      if (!isFallbackMode) {
        return mongoose.model('Skill').find(query);
      }
      return readJsonDb().skills;
    },
    create: async (data) => {
      if (!isFallbackMode) {
        return mongoose.model('Skill').create(data);
      }
      const db = readJsonDb();
      const newSkill = {
        _id: 's_' + Date.now().toString(36),
        ...data
      };
      db.skills.push(newSkill);
      writeJsonDb(db);
      return newSkill;
    },
    findByIdAndUpdate: async (id, data) => {
      if (!isFallbackMode) {
        return mongoose.model('Skill').findByIdAndUpdate(id, data, { new: true });
      }
      const db = readJsonDb();
      const idx = db.skills.findIndex(s => s._id === id);
      if (idx === -1) return null;
      db.skills[idx] = { ...db.skills[idx], ...data };
      writeJsonDb(db);
      return db.skills[idx];
    },
    findByIdAndDelete: async (id) => {
      if (!isFallbackMode) {
        return mongoose.model('Skill').findByIdAndDelete(id);
      }
      const db = readJsonDb();
      const idx = db.skills.findIndex(s => s._id === id);
      if (idx === -1) return null;
      const deleted = db.skills.splice(idx, 1)[0];
      writeJsonDb(db);
      return deleted;
    }
  },
  messages: {
    find: async () => {
      if (!isFallbackMode) {
        return mongoose.model('Message').find().sort({ date: -1 });
      }
      return readJsonDb().messages.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    create: async (data) => {
      if (!isFallbackMode) {
        return mongoose.model('Message').create(data);
      }
      const db = readJsonDb();
      const newMessage = {
        _id: 'm_' + Date.now().toString(36),
        date: new Date().toISOString(),
        readStatus: false,
        ...data
      };
      db.messages.push(newMessage);
      writeJsonDb(db);
      return newMessage;
    },
    findByIdAndUpdate: async (id, data) => {
      if (!isFallbackMode) {
        return mongoose.model('Message').findByIdAndUpdate(id, data, { new: true });
      }
      const db = readJsonDb();
      const idx = db.messages.findIndex(m => m._id === id);
      if (idx === -1) return null;
      db.messages[idx] = { ...db.messages[idx], ...data };
      writeJsonDb(db);
      return db.messages[idx];
    },
    findByIdAndDelete: async (id) => {
      if (!isFallbackMode) {
        return mongoose.model('Message').findByIdAndDelete(id);
      }
      const db = readJsonDb();
      const idx = db.messages.findIndex(m => m._id === id);
      if (idx === -1) return null;
      const deleted = db.messages.splice(idx, 1)[0];
      writeJsonDb(db);
      return deleted;
    }
  }
};
