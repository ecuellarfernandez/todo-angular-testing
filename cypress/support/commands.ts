/// <reference types="cypress" />

export const TEST_USER_EMAIL = 'test@test.com';
export const TEST_USER_PASSWORD = 'Test1@Test!';
export const API_URL = 'http://localhost:8080/api';

Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${API_URL}/auth/login`,
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
    window.localStorage.setItem('jwt', response.body.token);
  });
});

Cypress.Commands.add('createProject', (projectName: string) => {
  cy.get('[data-cy=add-project]').click();
  cy.get('[data-cy=project-title]').type(projectName);
  cy.get('[data-cy=submit-project]').click();
  cy.wait(500);
});

Cypress.Commands.add('createTodoList', (todolistName: string) => {
  cy.get('[data-cy=add-todolist]').click();
  cy.get('[data-cy=todolist-title]').type(todolistName);
  cy.get('[data-cy=submit-todolist]').click();
  cy.wait(500);
});

Cypress.Commands.add('createTask', (taskTitle: string, taskDescription?: string, dueDate?: string) => {
  cy.get('[data-cy=add-task]').first().click();
  
  cy.get('input[data-cy=task-title]').should('be.visible');
  
  cy.get('input[data-cy=task-title]').first().clear({ force: true }).type(taskTitle);
  
  if (taskDescription) {
    cy.get('textarea[data-cy=task-description]').first().clear({ force: true }).type(taskDescription);
  }
  
  if (dueDate) {
    cy.get('input[data-cy=task-due-date]').first().clear({ force: true }).type(dueDate);
  }
  
  cy.get('input[data-cy=task-title]').first().click().blur();
  
  cy.wait(1000);
  
  cy.get('[data-cy=submit-task]').should('not.be.disabled').click();
  
  cy.wait(1000);
});

Cypress.Commands.add('deleteProject', () => {
  cy.get('[data-cy=delete-project]').click();
  cy.get('[data-cy=confirm-delete]').click();
  cy.wait(500);
});

Cypress.Commands.add('deleteTodoList', () => {
  cy.get('[data-cy=delete-todolist]').click();
  cy.get('[data-cy=confirm-delete]').click();
  cy.wait(500);
});

Cypress.Commands.add('verifyTaskExists', (taskTitle: string) => {
  cy.get('[data-cy=task-item]', { timeout: 10000 }).should('exist');
  cy.get('[data-cy=task-item]').contains(taskTitle).should('exist');
});

Cypress.Commands.add('toggleTaskCompletion', (taskTitle: string) => {
  cy.get('[data-cy=task-item]')
    .contains(taskTitle)
    .closest('[data-cy=task-item]')
    .find('[data-cy=task-checkbox]')
    .click();
});

Cypress.Commands.add('editTask', (currentTitle: string, newTitle: string, newDescription?: string) => {
  cy.get('[data-cy=task-item]')
    .contains(currentTitle)
    .closest('[data-cy=task-item]')
    .find('[data-cy=edit-task]')
    .click();
  
  cy.get('input[data-cy=task-title]').should('be.visible').clear({ force: true }).type(newTitle);
  
  if (newDescription) {
    cy.get('textarea[data-cy=task-description]').clear({ force: true }).type(newDescription);
  }
  
  cy.get('input[data-cy=task-title]').click().blur();
  
  cy.wait(1000);
  
  cy.get('[data-cy=submit-task]').should('not.be.disabled').click();
  cy.wait(500);
});

Cypress.Commands.add('deleteTask', (taskTitle: string) => {
  cy.get('[data-cy=task-item]')
    .contains(taskTitle)
    .closest('[data-cy=task-item]')
    .find('[data-cy=delete-task]')
    .click();
  
  cy.get('[data-cy=confirm-delete]').click();
  cy.wait(500);
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginByApi(email: string, password: string): Chainable<void>;
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
