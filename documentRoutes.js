const express = require('express');
const Document = require('../models/Document'); // Model import

const router = express.Router();

// ✅ Get all documents
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get single document by ID
router.get('/:id', async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: "Document not found" });
        res.json(document);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Create a new document
router.post('/', async (req, res) => {
    const document = new Document({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedDocument = await document.save();
        res.status(201).json(savedDocument);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Update document
router.put('/:id', async (req, res) => {
    try {
        const updatedDocument = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDocument);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Delete document
router.delete('/:id', async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: "Document deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
