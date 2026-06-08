import express from 'express';
import { dbService } from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skills = await dbService.skills.find();
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving skills' });
  }
});

// @route   POST api/skills
// @desc    Create a skill
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { name, category, percentage } = req.body;

  if (!name || !category || percentage === undefined) {
    return res.status(400).json({ message: 'Name, category, and percentage are required' });
  }

  try {
    const newSkill = await dbService.skills.create({
      name,
      category,
      percentage: Number(percentage)
    });
    res.status(201).json(newSkill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating skill' });
  }
});

// @route   PUT api/skills/:id
// @desc    Update a skill
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, category, percentage } = req.body;

  try {
    const updatedSkill = await dbService.skills.findByIdAndUpdate(
      req.params.id,
      { name, category, percentage: percentage !== undefined ? Number(percentage) : undefined }
    );

    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json(updatedSkill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating skill' });
  }
});

// @route   DELETE api/skills/:id
// @desc    Delete a skill
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedSkill = await dbService.skills.findByIdAndDelete(req.params.id);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting skill' });
  }
});

export default router;
