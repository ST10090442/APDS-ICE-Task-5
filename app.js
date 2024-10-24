const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todo-list')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
});

// Define the schema and model for the To-Do items
const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

// GET /todos: Retrieve all to-do items from MongoDB
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving to-do items' });
    }
});

// POST /todos: Create a new to-do item in MongoDB
app.post('/todos', async (req, res) => {
    try {
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: 'Error creating to-do item' });
    }
});

// PUT /todos/:id: Update a to-do item by ID in MongoDB
app.put('/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).json({ message: 'To-Do not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating to-do item' });
    }
});

// DELETE /todos/:id: Delete a to-do item by ID from MongoDB
app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (deletedTodo) {
            res.status(200).json(deletedTodo);
        } else {
            res.status(404).json({ message: 'To-Do not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error deleting to-do item' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
