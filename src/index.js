const express=require("express")
const app=express()
const PORT=3000

//all todos
const data=[
    {id:1,title:"learn express",description:"learn express framework from anson the developer youtube channel",completed:false},
    {id:2,title:"buy meds",description:"order meds for dad",completed:false},
]

//http://localhost:3000/todos
//http://localhost:3000/todos?id=1
app.get("/todos",(req,res)=>{
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

app.use(express.json()) //middleware func
//http://localhost:3000/todos
app.post("/todos",(req,res)=>{
    let newTodo=req.body;
    newTodo= {id:data.length+1,...newTodo}
    data.push(newTodo)
    res.status(201).json(newTodo);
})

app.listen(PORT,()=>console.log(`express server running on port ${PORT}`))
