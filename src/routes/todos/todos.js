const express=require("express")
const {Router}=require("express");
const router=Router();

//all todos
const data=[
    {id:1,title:"learn express",description:"learn express framework from anson the developer youtube channel",completed:false},
    {id:2,title:"buy meds",description:"order meds for dad",completed:false},
]

//http://localhost:3000/todos
//http://localhost:3000/todos?id=1
router.get("/todos",(req,res)=>{
    let id=parseInt(req.query.id);
    if(id)
    {
        let fileteredData=data.find(todo=>todo.id===id);
        res.send(fileteredData);
    }
    else
    {
        res.send(data);
    }
})


// http://localhost:3000/todos/2
router.get("/todos/:id",(req,res)=>{
    let id=parseInt(req.params.id);
    (id)?res.send(data[id-1]):res.send("todo not found!");
})


router.use(express.json()) //middleware func
//http://localhost:3000/todos
router.post("/todos",(req,res)=>{
    let newTodo=req.body;
    newTodo= {id:data.length+1,...newTodo}
    data.push(newTodo)
    res.status(201).json(newTodo);
})

// http://localhost:3000/todos/4
router.put("/todos/:id",(req,res)=>{
    let todoId=parseInt(req.params.id);
    let todo=req.body;
    const todoIndexInTodosArray=data.findIndex(todo=>todo.id===todoId);
    if(todoIndexInTodosArray!==-1){
        data[todoIndexInTodosArray]={id:todoId,...todo}
        res.status(201).send(data);
    }
    else{
        res.status(404).json({error:"todo not found"});
    }
})


// http://localhost:3000/todos/1
router.patch("/todos/:id",(req,res)=>{
    let todoId=parseInt(req.params.id);
    let todoIndexInTodosArray=data.findIndex(todo=>todo.id===todoId);
    if(todoIndexInTodosArray===-1)
    {
        res.send('todo not found')
    }
    else{
        data[todoIndexInTodosArray].completed=req.body.completed;
        res.status(201).json(data[todoIndexInTodosArray]);
    }
})


// http://localhost:3000/todos/3
router.delete("/todos/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const todoIndex=data.findIndex(todo=>todo.id===id);
    if(todoIndex!==-1){
        const deletedTodo= data.splice(id-1,1)[0];
        res.json(deletedTodo);
    }
    else{
        res.status(404).json({error:"todo not found"});
    }
})


module.exports=router;