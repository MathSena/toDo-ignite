const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  //const { username } = request.headers;
//
  //const user = users.find((user)=> users.username === username);

 //if(user){
//return response.status(400).json({error: "Customer already exists!"});
//
  //}


  //request.user = user;

  //return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userExists = users.find(user => user.username === username);

 if(userExists){
    return response.status(400).json({error: "Username already exists!"});

  }

  const userData = { 
    id: uuidv4(), // precisa ser um uuid
    name,
    username,
    todos: []
  }

  users.push(userData)

  return response.status(201).json(userData);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;