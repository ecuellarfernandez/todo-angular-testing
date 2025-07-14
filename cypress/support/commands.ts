/// <reference types="cypress" />
import { setupApiMocks, clearMockData } from './api-mocks';

// Comando para configurar mocks de API
Cypress.Commands.add('setupApiMocks', () => {
  setupApiMocks();
});

// Comando para limpiar datos de mocks
Cypress.Commands.add('clearMockData', () => {
  clearMockData();
});

// Comando para login utilizando localStorage (simulando JWT)
Cypress.Commands.add('loginByApi', () => {
  // Simulamos el token JWT en localStorage con la clave correcta
  window.localStorage.setItem('jwt', 'fake-jwt-token-' + Date.now());
});

// Comando para crear proyecto usando UI
Cypress.Commands.add('createProject', (projectName: string) => {
  cy.get('[data-cy=add-project]').click();
  cy.get('[data-cy=project-title]').type(projectName);
  cy.get('[data-cy=submit-project]').click();
  // Esperar a que la API responda
  cy.wait('@createProject');
  cy.wait(500); // Esperar a que se cierre el modal
});

// Comando para crear todolist usando UI
Cypress.Commands.add('createTodoList', (todolistName: string) => {
  cy.get('[data-cy=add-todolist]').click();
  cy.get('[data-cy=todolist-title]').type(todolistName);
  cy.get('[data-cy=submit-todolist]').click();
  // Esperar a que la API responda
  cy.wait('@createTodoList');
  cy.wait(500); // Esperar a que se cierre el modal
});

// Comando para crear task usando UI
Cypress.Commands.add('createTask', (taskTitle: string, taskDescription?: string, dueDate?: string) => {
  cy.get('[data-cy=add-task]').first().click();
  
  // Verificar que el modal se abrió y buscar específicamente el input
  cy.get('input[data-cy=task-title]').should('be.visible');
  
  // Llenar el título (obligatorio)
  cy.get('input[data-cy=task-title]').first().clear({ force: true }).type(taskTitle);
  
  if (taskDescription) {
    cy.get('textarea[data-cy=task-description]').first().clear({ force: true }).type(taskDescription);
  }
  
  if (dueDate) {
    cy.get('input[data-cy=task-due-date]').first().clear({ force: true }).type(dueDate);
  }
  
  // Hacer click en el título para asegurar focus y trigger validaciones
  cy.get('input[data-cy=task-title]').first().click().blur();
  
  // Esperar a que el formulario sea válido
  cy.wait(1000);
  
  // Esperar a que el botón esté habilitado antes de hacer clic
  cy.get('[data-cy=submit-task]').should('not.be.disabled').click();
  
  // Esperar a que la API responda
  cy.wait('@createTask');
  cy.wait(1000); // Esperar más tiempo para que se cierre el modal
});

// Comando para eliminar proyecto usando UI
Cypress.Commands.add('deleteProject', () => {
  cy.get('[data-cy=delete-project]').click();
  cy.get('[data-cy=confirm-delete]').click();
  // Esperar a que la API responda
  cy.wait('@deleteProject');
  cy.wait(500); // Esperar a que se cierre el modal
});

// Comando para eliminar todolist usando UI
Cypress.Commands.add('deleteTodoList', () => {
  cy.get('[data-cy=delete-todolist]').click();
  cy.get('[data-cy=confirm-delete]').click();
  // Esperar a que la API responda
  cy.wait('@deleteTodoList');
  cy.wait(500); // Esperar a que se cierre el modal
});

// Comando para verificar que una tarea existe
Cypress.Commands.add('verifyTaskExists', (taskTitle: string) => {
  // Esperar a que aparezcan las tareas
  cy.get('[data-cy=task-item]', { timeout: 10000 }).should('exist');
  cy.get('[data-cy=task-item]').contains(taskTitle).should('exist');
});

// Comando para marcar/desmarcar tarea como completada
Cypress.Commands.add('toggleTaskCompletion', (taskTitle: string) => {
  cy.get('[data-cy=task-item]')
    .contains(taskTitle)
    .closest('[data-cy=task-item]')
    .find('[data-cy=task-checkbox]')
    .click();
  // Esperar a que la API responda
  cy.wait('@updateTaskStatus');
});

// Comando para editar tarea
Cypress.Commands.add('editTask', (currentTitle: string, newTitle: string, newDescription?: string) => {
  cy.get('[data-cy=task-item]')
    .contains(currentTitle)
    .closest('[data-cy=task-item]')
    .find('[data-cy=edit-task]')
    .click();
  
  // Esperar a que el modal se abra y buscar específicamente el input
  cy.get('input[data-cy=task-title]').should('be.visible').clear({ force: true }).type(newTitle);
  
  if (newDescription) {
    cy.get('textarea[data-cy=task-description]').clear({ force: true }).type(newDescription);
  }
  
  // Hacer click en el título para asegurar focus y trigger validaciones
  cy.get('input[data-cy=task-title]').click().blur();
  
  // Esperar a que el formulario sea válido
  cy.wait(1000);
  
  cy.get('[data-cy=submit-task]').should('not.be.disabled').click();
  // Esperar a que la API responda
  cy.wait('@updateTask');
  cy.wait(500);
});

// Comando para eliminar tarea
Cypress.Commands.add('deleteTask', (taskTitle: string) => {
  cy.get('[data-cy=task-item]')
    .contains(taskTitle)
    .closest('[data-cy=task-item]')
    .find('[data-cy=delete-task]')
    .click();
  
  cy.get('[data-cy=confirm-delete]').click();
  // Esperar a que la API responda
  cy.wait('@deleteTask');
  cy.wait(500);
});

declare global {
  namespace Cypress {
    interface Chainable {
      setupApiMocks(): Chainable<void>;
      clearMockData(): Chainable<void>;
      loginByApi(): Chainable<void>;
      createProject(projectName: string): Chainable<void>;
      createTodoList(todolistName: string): Chainable<void>;
      createTask(taskTitle: string, taskDescription?: string, dueDate?: string): Chainable<void>;
      deleteProject(): Chainable<void>;
      deleteTodoList(): Chainable<void>;
      verifyTaskExists(taskTitle: string): Chainable<void>;
      toggleTaskCompletion(taskTitle: string): Chainable<void>;
      editTask(currentTitle: string, newTitle: string, newDescription?: string): Chainable<void>;
      deleteTask(taskTitle: string): Chainable<void>;
    }
  }
}
