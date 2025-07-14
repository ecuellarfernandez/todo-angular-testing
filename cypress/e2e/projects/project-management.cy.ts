import { faker } from '@faker-js/faker';

describe('Gestión de Proyectos', () => {
  beforeEach(() => {
    cy.setupApiMocks();
    cy.clearMockData();
    cy.loginByApi();
    cy.visit('/dashboard');
    cy.wait('@getProjects');
  });

  describe('Creación de proyectos', () => {
    it('debería crear un proyecto exitosamente', () => {
      const projectName = faker.company.name();
      const projectDescription = faker.lorem.paragraph();

      cy.get('[data-cy=add-project]').click();
      cy.get('[data-cy=project-title]').type(projectName);
      cy.get('[data-cy=project-description]').type(projectDescription);
      cy.get('[data-cy=submit-project]').click();

      cy.wait('@createProject');
      cy.contains(projectName).should('be.visible');
    });

    it('debería validar campos requeridos', () => {
      cy.get('[data-cy=add-project]').click();
      
      // El botón debería estar deshabilitado si el nombre está vacío
      cy.get('[data-cy=submit-project]').should('be.disabled');
    });

    it('debería crear proyecto solo con nombre', () => {
      const projectName = faker.company.name();

      cy.get('[data-cy=add-project]').click();
      cy.get('[data-cy=project-title]').type(projectName);
      cy.get('[data-cy=submit-project]').click();

      cy.wait('@createProject');
      cy.contains(projectName).should('be.visible');
    });

    it('debería cerrar modal al cancelar', () => {
      cy.get('[data-cy=add-project]').click();
      cy.get('[data-cy=project-title]').should('be.visible');
      
      // Buscar botón de cancelar (puede variar el data-cy)
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

      // Crear proyecto
      cy.createProject(projectName);
      cy.contains(projectName).should('be.visible');

      // Verificar estructura del proyecto
      cy.get('[data-cy=project-item]').should('contain', projectName);
    });

    it('debería expandir y contraer proyectos', () => {
      const projectName = faker.company.name();

      cy.createProject(projectName);
      
      // Verificar que el proyecto está inicialmente contraído
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('svg')
        .should('not.have.class', 'rotate-90');

      // Expandir proyecto
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('h3')
        .click();
      cy.wait('@getTodoLists');
      
      // Verificar que el proyecto está expandido (icono rotado)
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('svg')
        .should('have.class', 'rotate-90');

      // Contraer proyecto
      cy.get('[data-cy=project-item]')
        .contains(projectName)
        .closest('[data-cy=project-item]')
        .find('h3')
        .click();
        
      // Verificar que el proyecto está contraído nuevamente
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
      
      // Buscar botón de editar proyecto
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
      
      // Editar proyecto
      cy.get('[data-cy=project-item]')
        .contains(originalName)
        .closest('[data-cy=project-item]')
        .find('[data-cy=edit-project]')
        .click();

      cy.get('[data-cy=project-title]').clear().type(newName);
      cy.get('[data-cy=submit-project]').click();

      cy.wait('@updateProject');
      cy.contains(newName).should('be.visible');
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

      cy.wait('@deleteProject');
      cy.contains(projectName).should('not.exist');
    });
  });

  describe('Estados de carga y error', () => {
    it('debería mostrar indicador de carga', () => {
      cy.visit('/dashboard');
      cy.get('.animate-spin').should('be.visible');
      cy.wait('@getProjects');
      cy.get('.animate-spin').should('not.exist');
    });

    it('debería manejar errores de carga', () => {
      // Mock error al cargar proyectos
      cy.intercept('GET', 'http://localhost:8080/api/projects', {
        statusCode: 500,
        body: { message: 'Error del servidor' }
      }).as('projectsError');

      cy.visit('/dashboard');
      cy.wait('@projectsError');
      
      cy.contains('Error al cargar los proyectos').should('be.visible');
    });
  });
});
