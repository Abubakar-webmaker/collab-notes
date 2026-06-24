const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all notes for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [{ owner: req.userId }, { collaborators: req.userId }]
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const note = await Note.create({ owner: req.userId });
    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!note) return res.status(404).json({ message: 'Not found or not authorized' });
    res.json({ message: 'Note deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;