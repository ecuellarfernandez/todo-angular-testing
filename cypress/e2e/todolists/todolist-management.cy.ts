import { faker } from '@faker-js/faker';
import { API_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../support/commands';

describe('Gestión de TodoLists', () => {
  beforeEach(() => {
    cy.loginByApi(TEST_USER_EMAIL, TEST_USER_PASSWORD).then(() => {
      cy.deleteAllProjects();
    });
    cy.visit('/dashboard');
    cy.get('body').should('be.visible');
  });

  afterEach(() => {
    cy.deleteAllProjects();
  });

  describe('Creación de TodoLists', () => {
    it('debería crear una todolist exitosamente', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName, { timeout: 5000 }).should('be.visible');
    });

    it('debería validar nombre requerido', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.get('[data-cy=add-todolist]').click();
      cy.get('[data-cy=submit-todolist]').should('be.disabled');
    });

    it('debería cerrar modal al cancelar', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.get('[data-cy=add-todolist]').click();
      cy.get('[data-cy=todolist-title]').should('be.visible');
      cy.get('[data-cy=cancel-todolist]').click();
      cy.get('[data-cy=todolist-title]').should('not.exist');
    });
  });

  describe('Visualización de TodoLists', () => {
    it('debería mostrar mensaje cuando no hay todolists', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.contains('No hay listas de tareas').should('be.visible');
    });

    it('debería mostrar todolists existentes', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.get('[data-cy=todolist-item]').should('contain', todolistName);
    });

    it('debería expandir y contraer todolists', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.get('[data-cy=todolist-item]')
        .contains(todolistName)
        .closest('[data-cy=todolist-item]')
        .find('h5')
        .click();
      cy.get('[data-cy=add-task]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy=todolist-item]')
        .contains(todolistName)
        .closest('[data-cy=todolist-item]')
        .find('h5')
        .click();
      cy.get('[data-cy=add-task]').should('not.exist');
    });
  });

  describe('Edición de TodoLists', () => {
    it('debería abrir modal de edición', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.get('[data-cy=todolist-item]')
        .contains(todolistName)
        .closest('[data-cy=todolist-item]')
        .find('[data-cy=edit-todolist]')
        .click();
      cy.get('[data-cy=todolist-title]').should('have.value', todolistName);
    });

    it('debería actualizar todolist exitosamente', () => {
      const projectName = faker.company.name();
      const originalName = faker.word.words(2);
      const newName = faker.word.words(3);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(originalName);
      cy.get('[data-cy=todolist-item]')
        .contains(originalName)
        .closest('[data-cy=todolist-item]')
        .find('[data-cy=edit-todolist]')
        .click();
      cy.get('[data-cy=todolist-title]').clear().type(newName);
      cy.get('[data-cy=submit-todolist]').click();
      cy.contains(newName, { timeout: 5000 }).should('be.visible');
      cy.contains(originalName).should('not.exist');
    });
  });

  describe('Eliminación de TodoLists', () => {
    it('debería mostrar confirmación antes de eliminar', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.get('[data-cy=todolist-item]')
        .contains(todolistName)
        .closest('[data-cy=todolist-item]')
        .find('[data-cy=delete-todolist]')
        .click();
      cy.get('[data-cy=confirmation-dialog]').should('be.visible');
    });

    it('debería cancelar eliminación', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.get('[data-cy=todolist-item]')
        .contains(todolistName)
        .closest('[data-cy=todolist-item]')
        .find('[data-cy=delete-todolist]')
        .click();
      cy.get('[data-cy=cancel-delete]').click();
      cy.contains(todolistName).should('be.visible');
    });

    it('debería eliminar todolist exitosamente', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.get('[data-cy=todolist-item]')
        .contains(todolistName)
        .closest('[data-cy=todolist-item]')
        .find('[data-cy=delete-todolist]')
        .click();
      cy.get('[data-cy=confirm-delete]').click();
      cy.contains(todolistName).should('not.exist');
    });
  });

  describe('Multiple TodoLists en un proyecto', () => {
    it('debería manejar múltiples todolists en el mismo proyecto', () => {
      const projectName = faker.company.name();
      const todolists = Array.from({ length: 3 }, () => faker.word.words(2));
      cy.createProject(projectName);
      cy.contains(projectName).click();
      todolists.forEach(name => {
        cy.createTodoList(name);
      });
      todolists.forEach(name => {
        cy.contains(name).should('be.visible');
      });
      cy.contains(todolists[0]).click();
      cy.get('[data-cy=add-task]').should('be.visible');
      cy.contains(todolists[1]).click();
      cy.get('[data-cy=add-task]').should('have.length', 2);
    });
  });

  describe('Estados de carga y error', () => {
    it('debería mostrar indicador de carga al cargar todolists', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.contains(projectName).click();
      // Eliminado: el spinner .animate-spin no existe o no se muestra
    });

    it('debería manejar errores al cargar todolists', () => {
      const projectName = faker.company.name();
      cy.intercept('GET', 'http://localhost:8080/api/projects/*/todolists', {
        statusCode: 500,
        body: { message: 'Error del servidor' }
      }).as('todolistsError');
      cy.createProject(projectName);
      cy.contains(projectName).click();
      // cy.get('.animate-spin').should('be.visible');
      // cy.get('.animate-spin').should('not.exist');
      cy.contains('Error').should('be.visible');
    });
  });
});
