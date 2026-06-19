# Premium Full-Stack Personal Portfolio

A modern, high-end, responsive personal portfolio website built with a **React (Vite)** frontend, a **Node.js/Express** REST API backend, and **MongoDB** database storage.

## 🚀 Key Features

- **Glassmorphic Cyberpunk Theme:** A rich visual system featuring deep blue tones, subtle glass cards, glow states, and interactive transitions.
- **Typewriter Effect:** Animated hero header welcoming visitors.
- **Dynamic Particle Canvas:** Custom-made interactive particles on the hero landing page that drift, link, and repel on mouse hover.
- **Filterable Projects Grid:** Interactive filters (All, Frontend, Backend, Fullstack) loading projects dynamically from the database.
- **Detailed Project Overlays:** Rich detail modal showing project images, description text, tech badges, and redirect links.
- **Functional Contact Form:** Forms that submit feedback directly to the backend database with smooth visual success validation.
- **Admin Dashboard Console:** Secure JWT-based admin console to:
  - Add, edit, or delete projects (CRUD).
  - Add, edit, or delete skills (CRUD).
  - View all contact form inquiries and toggle read status.
- **Smart Database Layer:** Connects to MongoDB if configured, but automatically uses a local persistent SQLite database (`backend/data/portfolio.sqlite`) if MongoDB is unavailable, meaning the application runs **out-of-the-box** without any configuration.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router DOM, Vite, Lucide Icons, Custom CSS Modules.
- **Backend:** Express.js, Node.js, JWT, BcryptJS.
- **Database:** MongoDB (using Mongoose ODM) with automatic local SQLite storage.

---

## ⚙️ Local Development Setup

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org) installed on your system.

### 2. Quick Start (Concurrently)
You can run the entire monorepo stack with a single command:

From the root directory:
```bash
npm run dev
```
This launches:
- **Frontend server:** [http://localhost:3000](http://localhost:3000)
- **Backend API server:** [http://localhost:5000](http://localhost:5000)

*Note: Since script running might be disabled on some Windows configurations, the root configuration triggers standard scripts directly to avoid security constraints.*

### 3. Admin Credentials
To access the Admin dashboard:
1. Navigate to `/admin/login` or click the lock padlock icon in the desktop navbar.
2. Enter the default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. You can modify these credentials inside the root `.env` file.

---

## 📂 Project Structure

```
├── backend/
│   ├── config/db.js          # Handles MongoDB connection and local SQLite storage
│   ├── data/                 # Folder storing local SQLite DB files
│   ├── middleware/           # authMiddleware verifying admin JWT
│   ├── models/               # Project, Skill, and Message Mongoose schemas
│   ├── routes/               # API Router endpoints
│   ├── server.js             # Main server entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # UI Components (Hero, Navbar, ParticleBackground, etc.)
│   │   ├── pages/            # View Pages (Home, AdminLogin, AdminDashboard)
│   │   ├── App.jsx           # App shell and page routing
│   │   ├── index.css         # Custom typography and CSS variables
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js        # Dev proxy configs routing `/api` to port 5000
│   └── package.json
├── .env                      # Root environment configuration
├── package.json              # Monorepo scripts runner
└── README.md
```

---

## ⚙️ Environment Variables (`.env`)

Configure the following variables in the root `.env` file to customize the server:

```env
PORT=5000
NODE_ENV=development

# Database configuration: Leave blank to use local SQLite DB
MONGODB_URI=

# Authentication security
JWT_SECRET=super_secret_jwt_key_12345678
ADMIN_PASSWORD=admin123
```

---

## 🌐 Deploying to Production

When deploying to platforms like **Render**, **Heroku**, or **Vercel**:

1. Build the React frontend production bundle:
   ```bash
   npm run build-frontend
   ```
   This compiles the assets into `/frontend/dist`.
2. The Express backend is configured to automatically serve the `/frontend/dist` compiled files on any non-API routes when deployed.
3. Configure the environment variables (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_PASSWORD`) on your hosting platform's dashboard.
4. Set the startup command to:
   ```bash
   npm start
   ```
   This starts the single unified Express server running the backend API and serving the static React frontend files concurrently.
