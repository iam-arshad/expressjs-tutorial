const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    todoId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
});

module.exports = mongoose.model('Todos', todoSchema);
