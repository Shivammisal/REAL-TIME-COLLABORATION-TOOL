const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json()); // JSON Data Handle करण्यासाठी

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// **🔹 MongoDB Connect**
mongoose.connect("mongodb://127.0.0.1:27017/realtime-editor", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// **🔹 Document Model**
const DocumentSchema = new mongoose.Schema({
    content: String
});
const Document = mongoose.model("Document", DocumentSchema);

// **🔹 API Route for Documents**
app.get("/documents", async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

app.post("/documents", async (req, res) => {
    try {
        const newDocument = new Document({ content: req.body.content });
        await newDocument.save();
        res.status(201).json(newDocument);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// **🔹 WebSocket Logic**
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('send_data', (data) => {
        socket.broadcast.emit('receive_data', data);
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

// **🔹 Server Start**
server.listen(5000, () => {
    console.log("✅ Server is running on http://localhost:5000");
});
