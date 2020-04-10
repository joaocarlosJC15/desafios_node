const express = require('express');

const Project = require('./project');

const server = express();

server.use(express.json());


const projects = [];

function checkRequiredFieldsProject(request, response, next)
{
  let errors = [];

  const requiredFields = ['id', 'title'];

  for(requiredField of requiredFields)
  {
    if(!request.body[requiredField])
    {
      errors.push(`O campo ${requiredField} é obrigatório para a criação de um projeto.`);
    }
  }

  if(errors.length > 0)
  {
    return response.status(400).json({errors: errors});
  }

  return next();
}

function checkRequiredFieldsToEditProject(request, response, next)
{
  let errors = [];

  const requiredFields = ['title'];

  for(requiredField of requiredFields)
  {
    if(!request.body[requiredField])
    {
      errors.push(`O campo ${requiredField} é obrigatório para a edição de um projeto.`);
    }
  }

  if(errors.length > 0)
  {
    return response.status(400).json({errors: errors});
  }

  return next();
}

function checkRequiredFieldsToAddTask(request, response, next)
{
  let errors = [];

  const requiredFields = ['title'];

  for(requiredField of requiredFields)
  {
    if(!request.body[requiredField])
    {
      errors.push(`O campo ${requiredField} é obrigatório para a adicionar uma task.`);
    }
  }

  if(errors.length > 0)
  {
    return response.status(400).json({errors: errors});
  }

  return next();
}

function verifyExistProject(request, response, next)
{
  const {id} = request.params;
  const index = projects.findIndex((project) => {
    if(project.id == id)
    {
      return true;
    }
  })

  if(index == -1)
  {
    return response.status(400).json({error: "Por favor, informe um valor de id válido."});
  }

  request.project = projects[index];

  return next();
}

server.post('/projects', checkRequiredFieldsProject, (request, response) => {
  const {id , title} = request.body;

  const project = new Project(id, title);
  projects.push(project);
  
  return response.json(projects)
})

server.post('/projects/:id/tasks', verifyExistProject, checkRequiredFieldsToAddTask, (request, response) => {
  const {title} = request.body;
  const {id} = request.params;

  const index = projects.findIndex((project) => {
    if(project.id == id)
    {
      return true;
    }
  })

  projects[index].tasks.push(title)

  return response.json({sucess: 'Task adicionada com sucesso ao projeto especificado.'})
})

server.get('/projects', (request, response) => {
  response.json(projects)
})

server.put('/projects/:id', verifyExistProject, checkRequiredFieldsToEditProject, (request, response) => {
  const {id} = request.params;

  const index = projects.findIndex((project) => {
    if(project.id == id)
    {
      return true
    }
  })

  projects[index].title = request.body.title;

  return response.json({sucess: 'Projetado editado com sucesso.'})
})

server.delete('/projects/:id', verifyExistProject, (request, response) => {
  const {id} = request.params;

  const index = projects.findIndex((project) => {
    if(project.id == id)
    {
      return true
    }
  })

  projects.splice(index,1);

  return response.json({sucess: 'Projeto deletado com sucesso.'})
})

server.listen(3333);