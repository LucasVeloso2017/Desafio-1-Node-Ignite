const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const findUser = users.find(i => i.username === username)

  if(!findUser){
    return response.status(404).json({error: 'Mensagem do erro'})
  }
  
  request.user = findUser

  next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name,username} = request.body

  const user = {
    id:uuidv4(),
    name,
    username,
    todos: []
  }

  const sameUser = users.find(i => i.username === user.username)

  if(sameUser){
    return response.status(400).json({error: 'Mensagem do erro'})
  }

  users.push(user)

  return response.status(201).json(user)
  

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { todos } = request.user

  return response.status(201).json(todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { todos } = request.user

  const {title,deadline} = request.body

  const todo = {
    id:uuidv4(),
    title,
    done:false,
    deadline:new Date(deadline),
    created_at:new Date()
  }

  const sameTodo = todos.find(i => i.title === todo.title)
  if(sameTodo){
    return response.status(400).json({error: 'Mensagem do erro'})
  }

  todos.push(todo)
  return response.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { todos } = request.user
  const {title,deadline} = request.body


  const findTodo = todos.find(i => i.id === id)

  if(!findTodo){
    return response.status(404).json({error: 'Mensagem do erro'})
  }
  
  findTodo.title = title
  findTodo.deadline = deadline

  return response.status(201).json(findTodo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { todos } = request.user
  
  const findTodo = todos.find(i => i.id === id)

  if(!findTodo){
    return response.status(404).json({error: 'Mensagem do erro'})
  }

  findTodo.done = true

  return response.status(201).json(findTodo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { todos } = request.user
  
  const findTodo = todos.find(i => i.id === id)

  if(!findTodo){
    return response.status(404).json({error: 'Mensagem do erro'})
  }

  const deleteTodo = todos.findIndex(i => i.id === id)

  todos.splice(deleteTodo,1)

  console.log(todos)


  return response.status(204).json({})
});

module.exports = app;