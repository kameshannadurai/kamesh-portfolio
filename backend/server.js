import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDbMode } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load environmental config
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Status endpoint
app.get('/api/status', (req, res) => {
  const modeInfo = getDbMode();
  res.json({
    status: 'online',
    fallbackMode: modeInfo.isFallback,
    database: modeInfo.dbPath
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);

// Serve Static Assets in production
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// For SPA routing, direct all other traffic to index.html in production
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // Pass API routes
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Connect Database
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server successfully launched on port ${PORT}`);
    const dbInfo = getDbMode();
    console.log(`📦 Database mode: ${dbInfo.isFallback ? '⚠️ Fallback (JSON file)' : '🟢 Active (MongoDB)'}`);
  });
});
