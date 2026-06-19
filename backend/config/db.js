import mongoose from 'mongoose';
import { DatabaseSync } from 'node:sqlite';
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
const SQLITE_DB_PATH = path.join(DATA_DIR, 'portfolio.sqlite');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isSqliteMode = false;
let sqliteDb;

const toBoolean = (value) => Boolean(Number(value));

const createId = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const mapProject = (row) => row && ({
  _id: row.id,
  title: row.title,
  description: row.description,
  category: row.category,
  tags: JSON.parse(row.tags || '[]'),
  imageUrl: row.image_url || '',
  githubUrl: row.github_url || '',
  liveUrl: row.live_url || '',
  featured: toBoolean(row.featured),
  createdAt: row.created_at
});

const mapSkill = (row) => row && ({
  _id: row.id,
  name: row.name,
  category: row.category,
  percentage: Number(row.percentage)
});

const mapMessage = (row) => row && ({
  _id: row.id,
  name: row.name,
  email: row.email,
  subject: row.subject,
  message: row.message,
  readStatus: toBoolean(row.read_status),
  date: row.date
});

const initSqlite = () => {
  sqliteDb = new DatabaseSync(SQLITE_DB_PATH);
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      image_url TEXT NOT NULL DEFAULT '',
      github_url TEXT NOT NULL DEFAULT '',
      live_url TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      percentage INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT 'No Subject',
      message TEXT NOT NULL,
      read_status INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL
    );
  `);
};

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    initSqlite();
    isSqliteMode = true;
    console.warn('\nNo MONGODB_URI found in environment variables.');
    console.warn(`Starting server with local SQLite database: ${SQLITE_DB_PATH}\n`);
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log('\nConnected to MongoDB Database successfully!\n');
    isSqliteMode = false;
  } catch (error) {
    console.error(`\nMongoDB connection failed: ${error.message}`);
    initSqlite();
    isSqliteMode = true;
    console.warn(`Switching to local SQLite database: ${SQLITE_DB_PATH}\n`);
  }
};

export const getDbMode = () => ({
  isFallback: isSqliteMode,
  dbPath: isSqliteMode ? SQLITE_DB_PATH : 'MongoDB Cloud/Local'
});

// Unified Database Service Abstraction
export const dbService = {
  projects: {
    find: async (query = {}) => {
      if (!isSqliteMode) {
        return mongoose.model('Project').find(query).sort({ createdAt: -1 });
      }

      if (query.featured !== undefined) {
        return sqliteDb
          .prepare('SELECT * FROM projects WHERE featured = ? ORDER BY created_at DESC')
          .all(query.featured ? 1 : 0)
          .map(mapProject);
      }

      return sqliteDb
        .prepare('SELECT * FROM projects ORDER BY created_at DESC')
        .all()
        .map(mapProject);
    },
    findById: async (id) => {
      if (!isSqliteMode) {
        return mongoose.model('Project').findById(id);
      }
      const item = mapProject(sqliteDb.prepare('SELECT * FROM projects WHERE id = ?').get(id));
      if (!item) throw new Error('Project not found');
      return item;
    },
    create: async (data) => {
      if (!isSqliteMode) {
        return mongoose.model('Project').create(data);
      }

      const newProject = {
        _id: createId('p'),
        createdAt: new Date().toISOString(),
        featured: false,
        tags: [],
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
        ...data
      };

      sqliteDb.prepare(`
        INSERT INTO projects (id, title, description, category, tags, image_url, github_url, live_url, featured, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newProject._id,
        newProject.title,
        newProject.description,
        newProject.category,
        JSON.stringify(newProject.tags || []),
        newProject.imageUrl || '',
        newProject.githubUrl || '',
        newProject.liveUrl || '',
        newProject.featured ? 1 : 0,
        newProject.createdAt
      );

      return newProject;
    },
    findByIdAndUpdate: async (id, data, options = {}) => {
      if (!isSqliteMode) {
        return mongoose.model('Project').findByIdAndUpdate(id, data, { new: true, ...options });
      }

      const current = await dbService.projects.findById(id).catch(() => null);
      if (!current) return null;
      const updated = { ...current, ...data };

      sqliteDb.prepare(`
        UPDATE projects
        SET title = ?, description = ?, category = ?, tags = ?, image_url = ?, github_url = ?, live_url = ?, featured = ?
        WHERE id = ?
      `).run(
        updated.title,
        updated.description,
        updated.category,
        JSON.stringify(updated.tags || []),
        updated.imageUrl || '',
        updated.githubUrl || '',
        updated.liveUrl || '',
        updated.featured ? 1 : 0,
        id
      );

      return dbService.projects.findById(id);
    },
    findByIdAndDelete: async (id) => {
      if (!isSqliteMode) {
        return mongoose.model('Project').findByIdAndDelete(id);
      }

      const deleted = await dbService.projects.findById(id).catch(() => null);
      if (!deleted) return null;
      sqliteDb.prepare('DELETE FROM projects WHERE id = ?').run(id);
      return deleted;
    }
  },
  skills: {
    find: async (query = {}) => {
      if (!isSqliteMode) {
        return mongoose.model('Skill').find(query);
      }
      return sqliteDb.prepare('SELECT * FROM skills ORDER BY rowid DESC').all().map(mapSkill);
    },
    create: async (data) => {
      if (!isSqliteMode) {
        return mongoose.model('Skill').create(data);
      }

      const newSkill = {
        _id: createId('s'),
        ...data
      };

      sqliteDb.prepare(`
        INSERT INTO skills (id, name, category, percentage)
        VALUES (?, ?, ?, ?)
      `).run(newSkill._id, newSkill.name, newSkill.category, Number(newSkill.percentage));

      return newSkill;
    },
    findByIdAndUpdate: async (id, data) => {
      if (!isSqliteMode) {
        return mongoose.model('Skill').findByIdAndUpdate(id, data, { new: true });
      }

      const current = mapSkill(sqliteDb.prepare('SELECT * FROM skills WHERE id = ?').get(id));
      if (!current) return null;
      const updated = { ...current, ...data };

      sqliteDb.prepare(`
        UPDATE skills
        SET name = ?, category = ?, percentage = ?
        WHERE id = ?
      `).run(updated.name, updated.category, Number(updated.percentage), id);

      return mapSkill(sqliteDb.prepare('SELECT * FROM skills WHERE id = ?').get(id));
    },
    findByIdAndDelete: async (id) => {
      if (!isSqliteMode) {
        return mongoose.model('Skill').findByIdAndDelete(id);
      }

      const deleted = mapSkill(sqliteDb.prepare('SELECT * FROM skills WHERE id = ?').get(id));
      if (!deleted) return null;
      sqliteDb.prepare('DELETE FROM skills WHERE id = ?').run(id);
      return deleted;
    }
  },
  messages: {
    find: async () => {
      if (!isSqliteMode) {
        return mongoose.model('Message').find().sort({ date: -1 });
      }
      return sqliteDb.prepare('SELECT * FROM messages ORDER BY date DESC').all().map(mapMessage);
    },
    create: async (data) => {
      if (!isSqliteMode) {
        return mongoose.model('Message').create(data);
      }

      const newMessage = {
        _id: createId('m'),
        date: new Date().toISOString(),
        readStatus: false,
        subject: 'No Subject',
        ...data
      };

      sqliteDb.prepare(`
        INSERT INTO messages (id, name, email, subject, message, read_status, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        newMessage._id,
        newMessage.name,
        newMessage.email,
        newMessage.subject || 'No Subject',
        newMessage.message,
        newMessage.readStatus ? 1 : 0,
        newMessage.date
      );

      return newMessage;
    },
    findByIdAndUpdate: async (id, data) => {
      if (!isSqliteMode) {
        return mongoose.model('Message').findByIdAndUpdate(id, data, { new: true });
      }

      const current = mapMessage(sqliteDb.prepare('SELECT * FROM messages WHERE id = ?').get(id));
      if (!current) return null;
      const updated = { ...current, ...data };

      sqliteDb.prepare(`
        UPDATE messages
        SET read_status = ?
        WHERE id = ?
      `).run(updated.readStatus ? 1 : 0, id);

      return mapMessage(sqliteDb.prepare('SELECT * FROM messages WHERE id = ?').get(id));
    },
    findByIdAndDelete: async (id) => {
      if (!isSqliteMode) {
        return mongoose.model('Message').findByIdAndDelete(id);
      }

      const deleted = mapMessage(sqliteDb.prepare('SELECT * FROM messages WHERE id = ?').get(id));
      if (!deleted) return null;
      sqliteDb.prepare('DELETE FROM messages WHERE id = ?').run(id);
      return deleted;
    }
  }
};
