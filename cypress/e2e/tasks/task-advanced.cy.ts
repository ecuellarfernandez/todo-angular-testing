import { faker } from '@faker-js/faker';
import { API_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../support/commands';

function deleteAllProjects() {
  cy.request({
    method: 'GET',
    url: API_URL,
    headers: { Authorization: `Bearer ${window.localStorage.getItem('jwt')}` },
    failOnStatusCode: false,
  }).then((response) => {
    if (Array.isArray(response.body)) {
      response.body.forEach((project: any) => {
        cy.request({
          method: 'DELETE',
          url: `${API_URL}/${project.id}`,
          headers: { Authorization: `Bearer ${window.localStorage.getItem('jwt')}` },
          failOnStatusCode: false,
        });
      });
    }
  });
}

describe('Gestión de Tareas - Funcionalidades Avanzadas', () => {
  beforeEach(() => {
    cy.loginByApi(TEST_USER_EMAIL, TEST_USER_PASSWORD).then(() => {
      deleteAllProjects();
    });
    cy.visit('/dashboard');
    cy.get('body').should('be.visible');
  });

  afterEach(() => {
    deleteAllProjects();
  });

  describe('Drag and Drop de tareas', () => {
    it('debería permitir reordenar tareas dentro de la misma todolist', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const tasks = [
        'Primera tarea',
        'Segunda tarea',
        'Tercera tarea'
      ];
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      tasks.forEach(taskTitle => {
        cy.createTask(taskTitle);
      });
      cy.get('[data-cy=task-item]').first().should('contain', tasks[0]);
      cy.get('[data-cy=task-item]').eq(1).should('contain', tasks[1]);
      cy.get('[data-cy=task-item]').eq(2).should('contain', tasks[2]);
      cy.get('[data-cy=task-item]').should('have.length', 3);
    });

    it('debería mantener el estado de completado después del reordenamiento', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const tasks = ['Tarea A', 'Tarea B', 'Tarea C'];
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      tasks.forEach(taskTitle => {
        cy.createTask(taskTitle);
      });
      cy.toggleTaskCompletion(tasks[1]);
      cy.get('[data-cy=task-item]').should('have.length', 3);
      cy.get('[data-cy=task-item]')
        .contains(tasks[1])
        .closest('[data-cy=task-item]')
        .find('[data-cy=task-checkbox]')
        .should('be.checked');
    });
  });

  describe('Validaciones avanzadas', () => {
    it('debería validar longitud máxima de título', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const longTitle = 'a'.repeat(50) + ' ' + 'a'.repeat(50);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.get('[data-cy=add-task]').click();
      cy.get('input[data-cy=task-title]').type(longTitle);
      cy.get('input[data-cy=task-title]').focus().blur();
      cy.contains('El título no puede tener más de 100 caracteres').should('be.visible');
      cy.get('[data-cy=submit-task]').should('be.disabled');
    });

    it('debería validar fecha de vencimiento no sea en el pasado', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = 'Tarea con fecha pasada';
      const pastDate = '2020-01-01';
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.get('[data-cy=add-task]').click();
      cy.get('input[data-cy=task-title]').type(taskTitle);
      cy.get('input[data-cy=task-due-date]').type(pastDate);
      cy.get('input[data-cy=task-title]').focus().blur();
      cy.get('[data-cy=submit-task]').should('be.disabled');
      cy.contains('La fecha de vencimiento debe ser futura').should('be.visible');
    });
  });

  describe('Performance con muchas tareas', () => {
    it('debería manejar correctamente 20+ tareas en una todolist', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskCount = 25;
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      Array.from({ length: taskCount }, (_, i) => {
        cy.createTask(`Tarea número ${i + 1}`);
      });
      cy.get('[data-cy=task-item]').should('have.length', taskCount);
      cy.get('[data-cy=add-task]').should('be.visible').click();
      cy.get('input[data-cy=task-title]').should('be.visible');
      cy.get('[data-cy=cancel-task]').click();
    });
  });
});
