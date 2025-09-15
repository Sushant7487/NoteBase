
// src/controllers/noteController.js
const Note = require("../models/note");
const Tenant = require("../models/tenant");

// Create Note
const createNote = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(400).json({ message: "Tenant not found" });

    // Enforce Free plan limit
    if (tenant.plan === "free") {
      const noteCount = await Note.countDocuments({ tenant: req.user.tenantId });
      if (noteCount >= 3) {
        return res.status(403).json({
          message: "Free plan limit reached. Please upgrade to Pro.",
        });
      }
    }

    const { title, content } = req.body;
    const note = await Note.create({
      title,
      content,
      tenant: req.user.tenantId,
      user: req.user._id,
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Notes (for the logged-in user's tenant)
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ tenant: req.user.tenantId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      tenant: req.user.tenantId,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Note
const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenant: req.user.tenantId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      tenant: req.user.tenantId,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};