const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3005;

app.use(express.json())
app.get("/", (req, res) => {
    res.send('<h1>Oscar Anillo</h1><p>Fullstack Developer</p>')
})

app.get("/todos", (req, res) => {
    const showPending = req.query.showpending


    fs.readFile("./store/todos.json", 'utf-8', (err, data) => {
        if(err) {
            return res.status(500).send(err)
        };
        const todos = JSON.parse(data);
        if(showPending !== '1') {
            return res.json({ todos: todos})
        } else {
            return res.json({ todos: todos.filter((t) => {
                return t.complete === false
            })})
        }
    })
})

app.post("/todos", (req, res) => {
    if(!req.body.name) {
        return res.status(400).send('Your to do needs a name!')
    }
    fs.readFile("./store/todos.json", 'utf-8', (err, data) => {
        if(err) {
            return res.status(500).send('There was an error reading the file')
        }
        const todos = JSON.parse(data);
        const maxId = Math.max.apply(Math, todos.map(t => { return t.id}))
        todos.push({
            id: maxId + 1,
            name: req.body.name,
            complete: false
        })
        fs.writeFile("./store/todos.json", JSON.stringify(todos), (err) => {
            if(err) throw err ;
            res.send('New todo has been added!')
        })
    })
})

app.patch("/todos/:id/complete", (req, res) => {
    const id = Number(req.params.id);

    const findById = (todos, id) => {
        for(let i = 0; i < todos.length; i++) {
            if(id === todos[i].id) {
                return i
            }
        }
        return -1 
    }

    fs.readFile("./store/todos.json", 'utf-8', (err, data) => {
        if(err) throw err;
        let todos = JSON.parse(data);
        const todoIndex = findById(todos, id);

        if(todoIndex === -1) {
            return res.status(404).send("Sorry! Item was not found!")
        }
        todos[todoIndex].complete = true;
        fs.writeFile("./store/todos.json", JSON.stringify(todos), () => {
            return res.json({ 'status': 'OK'})
        })
    })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))