import express from 'express';
import { dbService } from '../config/db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST api/messages
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  try {
    const newMessage = await dbService.messages.create({
      name,
      email,
      subject: subject || 'No Subject',
      message
    });
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending contact message' });
  }
});

// @route   GET api/messages
// @desc    Get all messages (inbox)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await dbService.messages.find();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving messages' });
  }
});

// @route   PUT api/messages/:id
// @desc    Update read status of a message
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { readStatus } = req.body;

  try {
    const updatedMessage = await dbService.messages.findByIdAndUpdate(
      req.params.id,
      { readStatus }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating message status' });
  }
});

// @route   DELETE api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedMessage = await dbService.messages.findByIdAndDelete(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting message' });
  }
});

export default router;
