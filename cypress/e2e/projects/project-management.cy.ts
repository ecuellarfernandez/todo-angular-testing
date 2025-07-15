import { faker } from '@faker-js/faker';
import { API_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../support/commands';

function deleteAllProjects() {
  cy.request({
    method: 'GET',
    url: API_URL,
    failOnStatusCode: false,
  }).then((response) => {
    if (Array.isArray(response.body)) {
      response.body.forEach((project: any) => {
        cy.request({
          method: 'DELETE',
          url: `${API_URL}/${project.id}`,
          failOnStatusCode: false,
        });
      });
    }
  });
}

describe('Gestión de Proyectos', () => {
  beforeEach(() => {
    deleteAllProjects();
    cy.loginByApi(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    cy.visit('/dashboard');
    cy.get('body').should('be.visible');
  });

  afterEach(() => {
    deleteAllProjects();
  });

  describe('Creación de proyectos', () => {
    it('debería crear un proyecto exitosamente', () => {
      const projectName = faker.company.name();
      const projectDescription = faker.lorem.paragraph();
      cy.get('[data-cy=add-project]').click();
      cy.get('[data-cy=project-title]').type(projectName);
      cy.get('[data-cy=project-description]').type(projectDescription);
      cy.get('[data-cy=submit-project]').click();
      cy.contains(projectName, { timeout: 5000 }).should('be.visible');
    });

    it('debería validar campos requeridos', () => {
      cy.get('[data-cy=add-project]').click();
      cy.get('[data-cy=submit-project]').should('be.disabled');
    });

    it('debería crear proyecto solo con nombre', () => {
      const projectName = faker.company.name();
      cy.get('[data-cy=add-project]').click();
      cy.get('[data-cy=project-title]').type(projectName);
      cy.get('[data-cy=submit-project]').click();
      cy.contains(projectName, { timeout: 5000 }).should('be.visible');
    });

    it('debería cerrar modal al cancelar', () => {
      cy.get('[data-cy=add-project]').click();
      cy.get('[data-cy=project-title]').should('be.visible');
      cy.get('button').contains('Cancelar').click();
      cy.get('[data-cy=project-title]').should('not.exist');
    });
  });

  describe('Visualización de proyectos', () => {
    it('debería mostrar lista vacía cuando no hay proyectos', () => {
      cy.contains('No tienes proyectos creados').should('be.visible');
      cy.contains('Crear primer proyecto').should('be.visible');
    });

    it('debería mostrar proyectos existentes', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.contains(projectName, { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy=project-item]').should('contain', projectName);
    });

    it('debería expandir y contraer proyectos', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('svg')
        .should('not.have.class', 'rotate-90');
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('h3')
        .click();
      cy.get('[data-cy=add-todolist]', { timeout: 5000 }).should('be.visible');
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('svg')
        .should('have.class', 'rotate-90');
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('h3')
        .click();
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('svg')
        .should('not.have.class', 'rotate-90');
    });
  });

  describe('Edición de proyectos', () => {
    it('debería abrir modal de edición', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('[data-cy=edit-project]')
        .click();
      cy.get('[data-cy=project-title]').should('have.value', projectName);
    });

    it('debería actualizar proyecto exitosamente', () => {
      const originalName = faker.company.name();
      const newName = faker.company.name();
      cy.createProject(originalName);
      cy.get('[data-cy=project-item]')
        .contains(originalName)
        .closest('[data-cy=project-item]')
        .find('[data-cy=edit-project]')
        .click();
      cy.get('[data-cy=project-title]').clear().type(newName);
      cy.get('[data-cy=submit-project]').click();
      cy.contains(newName, { timeout: 5000 }).should('be.visible');
      cy.contains(originalName).should('not.exist');
    });
  });

  describe('Eliminación de proyectos', () => {
    it('debería mostrar confirmación antes de eliminar', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('[data-cy=delete-project]')
        .click();
      cy.get('[data-cy=confirmation-dialog]').should('be.visible');
    });

    it('debería cancelar eliminación', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('[data-cy=delete-project]')
        .click();
      cy.get('[data-cy=cancel-delete]').click();
      cy.contains(projectName).should('be.visible');
    });

    it('debería eliminar proyecto exitosamente', () => {
      const projectName = faker.company.name();
      cy.createProject(projectName);
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('[data-cy=delete-project]')
        .click();
      cy.get('[data-cy=confirm-delete]').click();
      cy.contains(projectName).should('not.exist');
    });
  });
});
