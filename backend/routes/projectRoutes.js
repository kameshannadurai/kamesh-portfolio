import express from 'express';
import { dbService } from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await dbService.projects.find();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving projects' });
  }
});

// @route   GET api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await dbService.projects.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving project' });
  }
});

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, category, tags, imageUrl, githubUrl, liveUrl, featured } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Title, description, and category are required' });
  }

  try {
    const newProject = await dbService.projects.create({
      title,
      description,
      category,
      tags: tags || [],
      imageUrl: imageUrl || '',
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      featured: featured === true
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating project' });
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, category, tags, imageUrl, githubUrl, liveUrl, featured } = req.body;

  try {
    const updatedProject = await dbService.projects.findByIdAndUpdate(
      req.params.id,
      { title, description, category, tags, imageUrl, githubUrl, liveUrl, featured },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating project' });
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProject = await dbService.projects.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

export default router;
