// backend
"scripts"; { "start"; "node index.js", "dev"; "nodemon index.js" }



import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/todosApp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema + Model
const todoSchema = new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false },
    reminderTime: Date,
    reminded: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get("/todos", async(req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post("/todos", async(req, res) => {
    const todo = new Todo(req.body);
    await todo.save();
    res.json(todo);
});

app.put("/todos/:id", async(req, res) => {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(updated);
});

app.delete("/todos/:id", async(req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
// Start server