import { faker } from '@faker-js/faker';

describe('Gestión de TodoLists', () => {
  beforeEach(() => {
    cy.setupApiMocks();
    cy.clearMockData();
    cy.loginByApi();
    cy.visit('/dashboard');
    cy.wait('@getProjects');
  });

  describe('Creación de TodoLists', () => {
    it('debería crear una todolist exitosamente', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);

      // Crear proyecto primero
      cy.createProject(projectName);
      cy.contains(projectName).click(); // Expandir proyecto

      // Crear todolist
      cy.createTodoList(todolistName);
      cy.contains(todolistName).should('be.visible');
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

      // Expandir todolist
      cy.get('[data-cy=todolist-item]')
        .contains(todolistName)
        .closest('[data-cy=todolist-item]')
        .find('h5')
        .click();
      cy.wait('@getTasks');
      cy.get('[data-cy=add-task]').should('be.visible');

      // Contraer todolist
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

      // Editar todolist
      cy.get('[data-cy=todolist-item]')
        .contains(originalName)
        .closest('[data-cy=todolist-item]')
        .find('[data-cy=edit-todolist]')
        .click();

      cy.get('[data-cy=todolist-title]').clear().type(newName);
      cy.get('[data-cy=submit-todolist]').click();

      cy.wait('@updateTodoList');
      cy.contains(newName).should('be.visible');
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

      cy.wait('@deleteTodoList');
      cy.contains(todolistName).should('not.exist');
    });
  });

  describe('Multiple TodoLists en un proyecto', () => {
    it('debería manejar múltiples todolists en el mismo proyecto', () => {
      const projectName = faker.company.name();
      const todolists = Array.from({ length: 3 }, () => faker.word.words(2));

      cy.createProject(projectName);
      cy.contains(projectName).click();

      // Crear múltiples todolists
      todolists.forEach(name => {
        cy.createTodoList(name);
      });

      // Verificar que todas existen
      todolists.forEach(name => {
        cy.contains(name).should('be.visible');
      });

      // Verificar que se pueden expandir independientemente
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

      // Verificar que se llama a la API
      cy.wait('@getTodoLists');
    });

    it('debería manejar errores al cargar todolists', () => {
      const projectName = faker.company.name();

      // Mock error para todolists
      cy.intercept('GET', 'http://localhost:8080/api/projects/*/todolists', {
        statusCode: 500,
        body: { message: 'Error del servidor' }
      }).as('todolistsError');

      cy.createProject(projectName);
      cy.contains(projectName).click();

      cy.wait('@todolistsError');
      cy.contains('Error').should('be.visible');
    });
  });
});
