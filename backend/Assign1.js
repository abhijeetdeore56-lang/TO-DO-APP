const express = require('express')
const app = express()

app.use(express.json());

//create dictionry
let todos = [{
        "id": 1,
        "title": "Frontend",
        "completed": "false"
    },
    {
        "id": 2,
        "title": "backend",
        "completed": "false"
    },
    {
        "id": 3,
        "title": "homework",
        "completed": "false"
    }
];


//get method
app.get('/todos', (req, res) => {
    res.send(todos);
});

app.get("/todos/:id", (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send("Todo not found");
    res.json(todo);
});

//post method 
//app.post('/todos', (req, res) => {
//  todos.push('new todo');
//  res.send(todos);
//})

app.post("/todos", (req, res) => {
    const todo = { id: todos.length + 1, title: req.body.title };
    todos.push(todo);
    res.status(201).json(todo);
});



//put method 
// app.put('/todos', (req, res) => {

//    todos[0] = 'Updates todo item';
//res.send(todos);
//})



app.put("/todos/:id", (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send("Todo not found");
    todo.task = req.body.task;
    res.json(todo);
});



//delete method 
//app.delete('/todos', (req, res) => {
//  todos.splice(1, 1);
//console.log("delete item successfully");
//res.send(todos);
//})



app.delete("/todos/:id", (req, res) => {
    todos = todos.filter(t => t.id !== parseInt(req.params.id));
    res.send("Todo deleted");
});

//sever start
app.listen((4001), () => {
    console.log("Server is runing");
})