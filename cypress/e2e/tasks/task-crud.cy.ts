import { faker } from '@faker-js/faker';
import { API_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD } from '../../support/commands';

describe('Gestión de Tareas - CRUD', () => {
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

  describe('Creación de tareas', () => {
    it('debería crear una tarea básica exitosamente', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle);
      cy.verifyTaskExists(taskTitle);
    });

    it('debería crear tarea con descripción y fecha', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);
      const taskDescription = faker.lorem.paragraph();
      const dueDate = '2025-12-31';
      const expectedDisplayDate = '31/12/2025';
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle, taskDescription, dueDate);
      cy.verifyTaskExists(taskTitle);
      cy.get('[data-cy=task-item]')
        .contains(taskTitle)
        .closest('[data-cy=task-item]')
        .within(() => {
          cy.get('[data-cy=task-due-date-display]').should('contain', expectedDisplayDate);
        });
    });

    it('debería validar título requerido', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.get('[data-cy=add-task]').click();
      cy.get('[data-cy=submit-task]').should('be.disabled');
    });

    it('debería cerrar modal al cancelar', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.get('[data-cy=add-task]').click();
      cy.get('[data-cy=task-title]').should('be.visible');
      cy.get('[data-cy=cancel-task]').click();
      cy.get('[data-cy=task-title]').should('not.exist');
    });
  });

  describe('Visualización de tareas', () => {
    it('debería mostrar mensaje cuando no hay tareas', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.contains('No hay tareas').should('be.visible');
    });

    it('debería mostrar todas las tareas de una todolist', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const tasks = Array.from({ length: 3 }, () => faker.word.words(3));
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      tasks.forEach(taskTitle => {
        cy.createTask(taskTitle);
      });
      tasks.forEach(taskTitle => {
        cy.verifyTaskExists(taskTitle);
      });
    });

    it('debería mostrar estado de tarea correctamente', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle);
      cy.get('[data-cy=task-item]')
        .contains(taskTitle)
        .closest('[data-cy=task-item]')
        .find('[data-cy=task-checkbox]')
        .should('not.be.checked');
    });
  });

  describe('Modificación de estado de tareas', () => {
    it('debería marcar tarea como completada', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle);
      cy.toggleTaskCompletion(taskTitle);
      cy.get('[data-cy=task-item]')
        .contains(taskTitle)
        .closest('[data-cy=task-item]')
        .find('[data-cy=task-checkbox]')
        .should('be.checked');
    });

    it('debería desmarcar tarea completada', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle);
      cy.toggleTaskCompletion(taskTitle);
      cy.toggleTaskCompletion(taskTitle);
      cy.get('[data-cy=task-item]')
        .contains(taskTitle)
        .closest('[data-cy=task-item]')
        .find('[data-cy=task-checkbox]')
        .should('not.be.checked');
    });

    it('debería manejar múltiples tareas con diferentes estados', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const tasks = Array.from({ length: 3 }, () => faker.word.words(3));
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      tasks.forEach(taskTitle => {
        cy.createTask(taskTitle);
      });
      cy.toggleTaskCompletion(tasks[0]);
      cy.toggleTaskCompletion(tasks[2]);
      cy.get('[data-cy=task-item]')
        .contains(tasks[0])
        .closest('[data-cy=task-item]')
        .find('[data-cy=task-checkbox]')
        .should('be.checked');
      cy.get('[data-cy=task-item]')
        .contains(tasks[1])
        .closest('[data-cy=task-item]')
        .find('[data-cy=task-checkbox]')
        .should('not.be.checked');
      cy.get('[data-cy=task-item]')
        .contains(tasks[2])
        .closest('[data-cy=task-item]')
        .find('[data-cy=task-checkbox]')
        .should('be.checked');
    });
  });

  describe('Edición de tareas', () => {
    it('debería abrir modal de edición', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);
      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle);
      cy.get('[data-cy=task-item]')
        .contains(taskTitle)
        .closest('[data-cy=task-item]')
        .find('[data-cy=edit-task]')
        .click();
      cy.get('input[data-cy=task-title]').should('have.value', taskTitle);
    });

    it('debería actualizar tarea exitosamente', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const originalTitle = faker.word.words(3);
      const newTitle = faker.word.words(3);
      const newDescription = faker.lorem.paragraph();

      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(originalTitle);

      // Editar tarea
      cy.editTask(originalTitle, newTitle, newDescription);
      
      // Verificar cambios
      cy.verifyTaskExists(newTitle);
      cy.get('[data-cy=task-item]').should('not.contain', originalTitle);
    });
  });

  describe('Eliminación de tareas', () => {
    it('debería mostrar confirmación antes de eliminar', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);

      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle);

      cy.get('[data-cy=task-item]')
        .contains(taskTitle)
        .closest('[data-cy=task-item]')
        .find('[data-cy=delete-task]')
        .click();

      cy.get('[data-cy=confirmation-dialog]').should('be.visible');
    });

    it('debería cancelar eliminación', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);

      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle);

      cy.get('[data-cy=task-item]')
        .contains(taskTitle)
        .closest('[data-cy=task-item]')
        .find('[data-cy=delete-task]')
        .click();

      cy.get('[data-cy=cancel-delete]').click();
      cy.verifyTaskExists(taskTitle);
    });

    it('debería eliminar tarea exitosamente', () => {
      const projectName = faker.company.name();
      const todolistName = faker.word.words(2);
      const taskTitle = faker.word.words(3);

      cy.createProject(projectName);
      cy.contains(projectName).click();
      cy.createTodoList(todolistName);
      cy.contains(todolistName).click();
      cy.createTask(taskTitle);

      // Eliminar tarea
      cy.deleteTask(taskTitle);
      
      // Verificar que ya no existe - puede ser que no haya tareas o que específicamente no esté
      cy.get('body').then($body => {
        if ($body.find('[data-cy=task-item]').length > 0) {
          cy.get('[data-cy=task-item]').should('not.contain', taskTitle);
        } else {
          cy.contains('No hay tareas').should('be.visible');
        }
      });
    });
  });
});
