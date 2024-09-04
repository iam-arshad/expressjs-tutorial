const express = require("express")
const { Router } = require("express");
const router = Router();
const Todo = require("../../database/schemas/todos");
const crypto=require("crypto");

//http://localhost:3000/todos
//http://localhost:3000/todos?id=1
router.get("/", async (req, res) => {
    const id = req.query.todoId;
    const data= await Todo.find({userId:req.user.id})
    // queryparam
    if (id) {
        const filteredData = data.find(todo => todo.todoId === id);
        filteredData?res.status(200).json({todos:filteredData}):res.status(400).json({message:`No todo found with id:${id}`})
    }
    // without queryparam
    else {
        res.status(200).json({todos:data});
    }
})

// placed this api here as its considering "example" in /example as a todo id.
router.get("/example", (req, res, next) => {
    const err = new Error('This is a custom error message');
    err.status = 400;
    next(err);
})

// for better performance, replace /:id with a regex to handle only numbers as its value
// http://localhost:3000/todos/2
router.get("/:todoId", async (req, res) => {
    let id = req.params.todoId;
    try{
        const todo=await Todo.findOne({todoId:id})
        todo?res.status(200).json(todo):res.status(400).json({message:`todo not found with id ${id}`})
    }
    catch(e){
        res.status(500).json({message:e.message})
    }
})


// to generate a random id for a todo(bcoz keeping a middleware(for auto incrementing todo id) in schema will be a burden on server and db)
function generateRandomId(length = 16) {
    const buffer = crypto.randomBytes(length);
  return buffer.toString('hex');
  }

router.use(express.json()) //middleware func
//http://localhost:3000/todos
router.post("/", async (req, res) => {
    let newTodo = req.body;
    newTodo = { todoId: generateRandomId(), userId:req.user.id, ...newTodo }
    console.log(newTodo);
    try{
        const data= await Todo.create(newTodo);
        res.status(201).json(data);
    }
    catch(e){
        res.status(400).json({message:e.message});
    }
})

// http://localhost:3000/todos/4
router.put("/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    const updates = req.body;

    // security check not to update id's
    delete updates._id;
    delete updates.todoId;
    delete updates.userId;
    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { todoId: todoId }, // Query by todoId
            updates, // Update data
            { new: true, runValidators: true } // Return the updated document and validate updates
        );

        // Check if the todo was found and updated
        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).json({ message: `Todo not found with id ${todoId}` });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});



// http://localhost:3000/todos/1
router.patch("/:todoId", async (req, res) => {
    let id = req.params.todoId;
    try{
        let newTodoData={};
        if(req.body.title)newTodoData.title=req.body.title;
        if(req.body.description)newTodoData.description=req.body.description;
        if (req.body.hasOwnProperty('completed')) {
            const completedValue = req.body.completed;
            // Convert to boolean based on explicit string values or actual boolean
            if (completedValue === 'true' || completedValue === true) {
                newTodoData.completed = true;
            } else if (completedValue === 'false' || completedValue === false) {
                newTodoData.completed = false;
            } else {
                // Handle invalid boolean input or omit if invalid
                return res.status(400).json({ message: 'Invalid value for completed field' });
            }
        }
        console.log(newTodoData,req.body.completed);
        const todo=await Todo.findOneAndUpdate({todoId:id},newTodoData,{new:true});
        todo?res.status(200).json(todo):res.status(400).json({message:`todo not found with id ${id}`})
    }
    catch(e){
        res.status(500).json({message:e.message})
    }
})


// http://localhost:3000/todos/3
router.delete("/:todoId", async (req, res) => {
    const id = req.params.todoId;
    try{
        const todo=await Todo.findOneAndDelete({todoId:id});
        todo?res.status(200).json(todo):res.status(400).json({message:`todo not found with id ${id}`})
    }
    catch(e){
        res.status(500).json({message:e.message})
    }
})

module.exports = router;