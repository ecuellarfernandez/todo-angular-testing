import { faker } from '@faker-js/faker';

// Tipos de datos para mantener consistencia
interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoList {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  projectId: string;
  todoListId: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

// Almacenes de datos en memoria
let projects: Project[] = [];
let todoLists: TodoList[] = [];
let tasks: Task[] = [];

// Utilidades para generar IDs únicos
const generateId = () => faker.string.uuid();
const generateDate = () => new Date().toISOString();

// Función para limpiar datos
export const clearMockData = () => {
  projects = [];
  todoLists = [];
  tasks = [];
};

export const setupApiMocks = () => {
  // Mock para autenticación
  cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
    statusCode: 200,
    body: {
      token: 'fake-jwt-token-' + Date.now(),
      user: {
        id: faker.string.uuid(),
        email: 'test@test.com',
        username: 'Test User'
      }
    }
  }).as('login');

  // Mock para obtener usuario actual
  cy.intercept('GET', 'http://localhost:8080/api/auth/me', {
    statusCode: 200,
    body: {
      id: faker.string.uuid(),
      email: 'test@test.com',
      username: 'Test User'
    }
  }).as('getCurrentUser');

  // PROJECTS API
  // Obtener todos los proyectos
  cy.intercept('GET', 'http://localhost:8080/api/projects', (req) => {
    req.reply({
      statusCode: 200,
      body: projects
    });
  }).as('getProjects');

  // Crear proyecto
  cy.intercept('POST', 'http://localhost:8080/api/projects', (req) => {
    const newProject: Project = {
      id: generateId(),
      name: req.body.name,
      description: req.body.description || '',
      createdAt: generateDate(),
      updatedAt: generateDate()
    };
    projects.push(newProject);
    
    req.reply({
      statusCode: 201,
      body: newProject
    });
  }).as('createProject');

  // Obtener proyecto por ID
  cy.intercept('GET', 'http://localhost:8080/api/projects/*', (req) => {
    const projectId = req.url.split('/').pop();
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
      req.reply({
        statusCode: 200,
        body: project
      });
    } else {
      req.reply({
        statusCode: 404,
        body: { message: 'Project not found' }
      });
    }
  }).as('getProject');

  // Actualizar proyecto
  cy.intercept('PUT', 'http://localhost:8080/api/projects/*', (req) => {
    const projectId = req.url.split('/').pop();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        name: req.body.name,
        description: req.body.description || '',
        updatedAt: generateDate()
      };
      
      req.reply({
        statusCode: 200,
        body: projects[projectIndex]
      });
    } else {
      req.reply({
        statusCode: 404,
        body: { message: 'Project not found' }
      });
    }
  }).as('updateProject');

  // Eliminar proyecto
  cy.intercept('DELETE', 'http://localhost:8080/api/projects/*', (req) => {
    const projectId = req.url.split('/').pop();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      // Eliminar también todas las todolists y tasks del proyecto
      todoLists = todoLists.filter(tl => tl.projectId !== projectId);
      tasks = tasks.filter(t => t.projectId !== projectId);
      projects.splice(projectIndex, 1);
      
      req.reply({
        statusCode: 204,
        body: null
      });
    } else {
      req.reply({
        statusCode: 404,
        body: { message: 'Project not found' }
      });
    }
  }).as('deleteProject');

  // TODOLISTS API
  // Obtener todolists de un proyecto
  cy.intercept('GET', 'http://localhost:8080/api/projects/*/todolists', (req) => {
    const projectId = req.url.split('/')[req.url.split('/').length - 2];
    const projectTodoLists = todoLists.filter(tl => tl.projectId === projectId);
    
    req.reply({
      statusCode: 200,
      body: projectTodoLists
    });
  }).as('getTodoLists');

  // Crear todolist
  cy.intercept('POST', 'http://localhost:8080/api/projects/*/todolists', (req) => {
    const projectId = req.url.split('/')[req.url.split('/').length - 2];
    const newTodoList: TodoList = {
      id: generateId(),
      projectId: projectId,
      name: req.body.name,
      createdAt: generateDate(),
      updatedAt: generateDate()
    };
    todoLists.push(newTodoList);
    
    req.reply({
      statusCode: 201,
      body: newTodoList
    });
  }).as('createTodoList');

  // Actualizar todolist
  cy.intercept('PUT', 'http://localhost:8080/api/projects/*/todolists/*', (req) => {
    const todoListId = req.url.split('/').pop();
    const todoListIndex = todoLists.findIndex(tl => tl.id === todoListId);
    
    if (todoListIndex !== -1) {
      todoLists[todoListIndex] = {
        ...todoLists[todoListIndex],
        name: req.body.name,
        updatedAt: generateDate()
      };
      
      req.reply({
        statusCode: 200,
        body: todoLists[todoListIndex]
      });
    } else {
      req.reply({
        statusCode: 404,
        body: { message: 'TodoList not found' }
      });
    }
  }).as('updateTodoList');

  // Eliminar todolist
  cy.intercept('DELETE', 'http://localhost:8080/api/projects/*/todolists/*', (req) => {
    const todoListId = req.url.split('/').pop();
    const todoListIndex = todoLists.findIndex(tl => tl.id === todoListId);
    
    if (todoListIndex !== -1) {
      // Eliminar también todas las tasks de la todolist
      tasks = tasks.filter(t => t.todoListId !== todoListId);
      todoLists.splice(todoListIndex, 1);
      
      req.reply({
        statusCode: 204,
        body: null
      });
    } else {
      req.reply({
        statusCode: 404,
        body: { message: 'TodoList not found' }
      });
    }
  }).as('deleteTodoList');

  // TASKS API
  // Obtener tasks de una todolist
  cy.intercept('GET', 'http://localhost:8080/api/projects/*/todolists/*/tasks', (req) => {
    const urlParts = req.url.split('/');
    const todoListId = urlParts[urlParts.length - 2];
    const todoListTasks = tasks
      .filter(t => t.todoListId === todoListId)
      .sort((a, b) => a.position - b.position);
    
    req.reply({
      statusCode: 200,
      body: todoListTasks
    });
  }).as('getTasks');

  // Crear task
  cy.intercept('POST', 'http://localhost:8080/api/projects/*/todolists/*/tasks', (req) => {
    const urlParts = req.url.split('/');
    const projectId = urlParts[urlParts.length - 4];
    const todoListId = urlParts[urlParts.length - 2];
    
    // Calcular la siguiente posición
    const existingTasks = tasks.filter(t => t.todoListId === todoListId);
    const nextPosition = existingTasks.length > 0 
      ? Math.max(...existingTasks.map(t => t.position)) + 1 
      : 0;
    
    const newTask: Task = {
      id: generateId(),
      projectId: projectId,
      todoListId: todoListId,
      title: req.body.title,
      description: req.body.description || '',
      completed: false,
      dueDate: req.body.dueDate || null,
      position: nextPosition,
      createdAt: generateDate(),
      updatedAt: generateDate()
    };
    tasks.push(newTask);
    
    req.reply({
      statusCode: 201,
      body: newTask
    });
  }).as('createTask');

  // Actualizar task
  cy.intercept('PUT', 'http://localhost:8080/api/projects/*/todolists/*/tasks/*', (req) => {
    const taskId = req.url.split('/').pop();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: req.body.title || tasks[taskIndex].title,
        description: req.body.description !== undefined ? req.body.description : tasks[taskIndex].description,
        completed: req.body.completed !== undefined ? req.body.completed : tasks[taskIndex].completed,
        dueDate: req.body.dueDate !== undefined ? req.body.dueDate : tasks[taskIndex].dueDate,
        updatedAt: generateDate()
      };
      
      req.reply({
        statusCode: 200,
        body: tasks[taskIndex]
      });
    } else {
      req.reply({
        statusCode: 404,
        body: { message: 'Task not found' }
      });
    }
  }).as('updateTask');

  // Actualizar estado de task
  cy.intercept('PATCH', 'http://localhost:8080/api/projects/*/todolists/*/tasks/*/status', (req) => {
    const taskId = req.url.split('/')[req.url.split('/').length - 2];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        completed: req.body.completed,
        updatedAt: generateDate()
      };
      
      req.reply({
        statusCode: 200,
        body: tasks[taskIndex]
      });
    } else {
      req.reply({
        statusCode: 404,
        body: { message: 'Task not found' }
      });
    }
  }).as('updateTaskStatus');

  // Reordenar tasks
  cy.intercept('PUT', 'http://localhost:8080/api/projects/*/todolists/*/tasks/reorder', (req) => {
    const urlParts = req.url.split('/');
    const todoListId = urlParts[urlParts.length - 3];
    const taskIds = req.body.taskIds;
    
    // Actualizar posiciones
    taskIds.forEach((taskId: string, index: number) => {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].position = index;
        tasks[taskIndex].updatedAt = generateDate();
      }
    });
    
    const reorderedTasks = tasks
      .filter(t => t.todoListId === todoListId)
      .sort((a, b) => a.position - b.position);
    
    req.reply({
      statusCode: 200,
      body: reorderedTasks
    });
  }).as('reorderTasks');

  // Eliminar task
  cy.intercept('DELETE', 'http://localhost:8080/api/projects/*/todolists/*/tasks/*', (req) => {
    const taskId = req.url.split('/').pop();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      
      req.reply({
        statusCode: 204,
        body: null
      });
    } else {
      req.reply({
        statusCode: 404,
        body: { message: 'Task not found' }
      });
    }
  }).as('deleteTask');

  // Obtener tareas recientes
  cy.intercept('GET', 'http://localhost:8080/api/tasks/recent', (req) => {
    const recentTasks = tasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    req.reply({
      statusCode: 200,
      body: recentTasks
    });
  }).as('getRecentTasks');
};

// Función para obtener datos actuales (útil para debugging)
export const getMockData = () => ({
  projects,
  todoLists,
  tasks
});
