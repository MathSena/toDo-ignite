const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Middleware para verificação de existência de conta de usuário
function checksExistsUserAccount(request, response, next) {
    const {username} = request.headers;
    const user = users.find(user => user.username === username); //Realizando a busca 

    if(!user){ // Se não encontrar o usuário...
      return response.status(404).json({error: "User not found!"});
    }

    request.user = user;

    return next(); // Prossiga
}

// Criação de usuário
app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const userExists = users.find(user => user.username === username);

  if(userExists){ //Se o username existir
    return response.status(400).json({error: "Username already exists!"});

  }

  const userData = { 
    id: uuidv4(), // precisa ser um uuid
    name,
    username,
    todos: []
  }

  users.push(userData); // Adicionando os usuários no array
  return response.status(201).json(userData);

});

// Listagem de todos
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos); 
});

// Postagens de todos
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const {title, deadline } = request.body;

  const todo = { 
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo)

});

// Atualizando um todo pelo seu ID
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id); //Buscanso o todo pelo id no array -> Retornará True or False

  if(!todo){ // Se não encontrar o todo no array...
    return response.status(404).json({error: "Todo not found"});
  }

  //Atualizando o todo
  todo.title = title; 
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

// Atualizando um todo colocando como done
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({error: "Todo not found"});
  }

  todo.done = true;

  return response.json(todo);

});

// Deletando o todo
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id); // Realizando a busca do todo pelo index

  if(todoIndex === -1){ // Se não encontrar o todo
    return response.status(404).json({error: "Todo not found"})
  }

 user.todos.splice(todoIndex, 1); // Realizandpo a deleção

 return response.status(204).json();

});

module.exports = app;