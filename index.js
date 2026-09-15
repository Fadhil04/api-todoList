const express = require('express');
const app = express();
const PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

let tasks = [
    {id: 1, title: "Buy milk", done:false},
    {id: 2, title: "Walk the dog", done: true},
    {id: 3, title: "Finish internship", done: false},
]

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

app.get('/health', (req, res) =>{
    res.json({status:"ok"});
});

app.get("/tasks", (req, res)=> {
    res.json(tasks);
});

app.get('/tasks/:id', (req, res)=> {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id ===id);

    if(!task){
        return res.status(404).json({error: `Task ${id} not found`});
    }

    res.json(task);

});

app.post('/tasks', (req, res)=>{
    const {title} = req.body;

    if (!title || title.trim()=== ''){
        return res.status(400).json({error: "Title is rquaired"});
    };

    const newId = tasks.length > 0
     ? Math.max(...tasks.map(t => t.id)) + 1
     : 1;

    const newTask = {id: newId, title, done:false};
    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task){
        return res.status(404).json({error: `Task ${id} not found`});
    }

    const {title, done} = req.body;

    if (title !== undefined && title.trim()=== ''){
        return res.status(404).json({error: "Title connot be empty"});
    };

    if (title !== undefined) task.title = title;
    if (done !== undefined) task.done = done;

    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index  = tasks.findIndex(t => t.id === id);

    if (index === -1){
        return res.status(404).json({error: `Task ${id} not found`});
    }

    tasks.splice(index, 1);
    res.status(204).send();
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});