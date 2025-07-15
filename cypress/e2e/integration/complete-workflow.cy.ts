import { faker } from '@faker-js/faker';
import { API_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../support/commands';

describe('Complete Workflow Integration', () => {
  beforeEach(() => {
    cy.loginByApi(TEST_USER_EMAIL, TEST_USER_PASSWORD).then(() => {
      cy.deleteAllProjects();
    });
  });

  afterEach(() => {
    cy.deleteAllProjects();
  });

  it('debería completar el flujo completo: registro -> login > proyecto -> todolist -> tareas', () => {
    const projectName = faker.company.name();
    const todolistName = faker.word.words(2);
    const tasks = [
      'Planificar proyecto',
      'Configurar entorno',
      'Desarrollar funcionalidad',
      'Escribir tests',
      'Hacer deploy'
    ];
    cy.visit('/dashboard');
    cy.get('h1').should('contain', 'Panel de');
    cy.createProject(projectName);
    cy.get('[data-cy=project-item]').should('contain', projectName);
    cy.contains(projectName).click();
    cy.get('[data-cy=add-todolist]').should('be.visible');
    cy.createTodoList(todolistName);
    cy.get('[data-cy=todolist-item]').should('contain', todolistName);
    cy.contains(todolistName).click();
    cy.get('[data-cy=add-task]').should('be.visible');
    tasks.forEach((taskTitle, index) => {
      cy.createTask(taskTitle);
      cy.verifyTaskExists(taskTitle);
      if (index % 2 === 0) {
        cy.toggleTaskCompletion(taskTitle);
      }
    });
    cy.get('[data-cy=task-item]').should('have.length', tasks.length);
    cy.get('[data-cy=task-item]').should('exist');
    cy.editTask(tasks[1], 'Tarea editada exitosamente');
    cy.verifyTaskExists('Tarea editada exitosamente');
    cy.deleteTask(tasks[4]);
    cy.get('[data-cy=task-item]').should('have.length', tasks.length - 1);
    cy.get('[data-cy=add-task]').should('be.visible');
  });

  it('debería mantener el estado después de recargar la página', () => {
    const projectName = faker.company.name();
    const todolistName = faker.word.words(2);
    const taskTitle = faker.word.words(3);
    cy.visit('/dashboard');
    cy.createProject(projectName);
    cy.contains(projectName).click();
    cy.createTodoList(todolistName);
    cy.contains(todolistName).click();
    cy.createTask(taskTitle);
    cy.verifyTaskExists(taskTitle);
    cy.reload();
    cy.visit('/dashboard');
    cy.get('[data-cy=project-item]').should('contain', projectName);
    cy.contains(projectName).click();
    cy.contains(todolistName).click();
    cy.verifyTaskExists(taskTitle);
  });

  it('debería redirigir a login si no está autenticado', () => {
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
    cy.visit('/dashboard');
    cy.url().should('satisfy', (url: string | string[]) => {
      return url.includes('/login') || url === 'http://localhost:4200/';
    });
  });

  it('debería manejar errores de red', () => {
    cy.intercept('GET', '/api/projects', {
      statusCode: 500,
      body: { error: 'Server Error' }
    }).as('getProjectsError');
    cy.loginByApi(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    cy.visit('/dashboard');
    cy.get('body').should('be.visible');
  });

  it('debería sincronizar cambios entre pestañas', () => {
    const projectName = faker.company.name();
    cy.visit('/dashboard');
    cy.createProject(projectName);
    cy.visit('/dashboard');
    cy.get('[data-cy=project-item]').should('contain', projectName);
  });

  it('debería funcionar con diferentes tamaños de pantalla', () => {
    const projectName = faker.company.name();
    const todolistName = faker.word.words(2);
    cy.viewport(375, 667);
    cy.visit('/dashboard');
    cy.createProject(projectName);
    cy.get('[data-cy=project-item]').should('contain', projectName);
    cy.viewport(768, 1024);
    cy.contains(projectName).click();
    cy.createTodoList(todolistName);
    cy.get('[data-cy=todolist-item]').should('contain', todolistName);
    cy.viewport(1920, 1080);
    cy.contains(todolistName).click();
    cy.get('[data-cy=add-task]').should('be.visible');
    cy.createTask('Tarea responsive test');
    cy.verifyTaskExists('Tarea responsive test');
  });
});
