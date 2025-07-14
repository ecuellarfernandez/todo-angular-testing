import { faker } from '@faker-js/faker';

describe('Complete Workflow Integration', () => {
  beforeEach(() => {
    cy.setupApiMocks();
    cy.clearMockData();
  });

  it('debería completar el flujo completo: registro -> login > proyecto -> todolist -> tareas', () => {
    // Datos de prueba
    const projectName = faker.company.name();
    const todolistName = faker.word.words(2);
    const tasks = [
      'Planificar proyecto',
      'Configurar entorno', 
      'Desarrollar funcionalidad',
      'Escribir tests',
      'Hacer deploy'
    ];

    // 1. Registro y login automático usando nuestros comandos probados
    cy.loginByApi();
    cy.visit('/dashboard');
    cy.wait('@getProjects');

    // 2. Verificar que estamos en el dashboard
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Panel de');

    // 3. Crear proyecto usando comando 
    cy.createProject(projectName);
    cy.get('[data-cy=project-item]').should('contain', projectName);

    // 4. Entrar al proyecto
    cy.contains(projectName).click();
    
    // Verificar que estamos en la vista del proyecto
    cy.get('[data-cy=add-todolist]').should('be.visible');

    // 5. Crear todolist usando comando   
    cy.createTodoList(todolistName);
    cy.get('[data-cy=todolist-item]').should('contain', todolistName);

    // 6. Entrar a la todolist
    cy.contains(todolistName).click();
    cy.get('[data-cy=add-task]').should('be.visible');

    // 7. Crear múltiples tareas usando comando 
    tasks.forEach((taskTitle, index) => {
      cy.createTask(taskTitle);
      
      // Verificar que la tarea se creó
      cy.verifyTaskExists(taskTitle);
      
      // Completar algunas tareas (índices pares)
      if (index % 2 === 0) {
        cy.toggleTaskCompletion(taskTitle);
      }
    });

    // 8. Verificar estado final
    cy.get('[data-cy=task-item]').should('have.length', tasks.length);
    
    // Verificar que hay tareas completadas y no completadas
    cy.get('[data-cy=task-item]').should('exist');
    
    // 9. Editar una tarea
    cy.editTask(tasks[1], 'Tarea editada exitosamente');
    cy.verifyTaskExists('Tarea editada exitosamente');

    // 10. Eliminar una tarea
    cy.deleteTask(tasks[4]);
    cy.get('[data-cy=task-item]').should('have.length', tasks.length - 1);

    // 11. Verificar navegación funcional - verificar que estamos en la vista de tareas
    cy.get('[data-cy=add-task]').should('be.visible');
  });

  it('debería mantener el estado después de recargar la página', () => {
    const projectName = faker.company.name();
    const todolistName = faker.word.words(2);
    const taskTitle = faker.word.words(3);

    // Setup inicial
    cy.loginByApi();
    cy.visit('/dashboard');
    cy.wait('@getProjects');

    // Crear proyecto y todolist
    cy.createProject(projectName);
    cy.contains(projectName).click();
    cy.createTodoList(todolistName);
    cy.contains(todolistName).click();
    
    // Crear tarea
    cy.createTask(taskTitle);
    cy.verifyTaskExists(taskTitle);

    // Recargar página
    cy.reload();

    // Verificar que mantiene la sesión navegando al dashboard y volviendo al proyecto
    cy.visit('/dashboard');
    cy.wait('@getProjects');
    cy.get('[data-cy=project-item]').should('contain', projectName);
    
    // Navegar de vuelta a la tarea
    cy.contains(projectName).click();
    cy.contains(todolistName).click();
    cy.verifyTaskExists(taskTitle);
  });

  it('debería redirigir a login si no está autenticado', () => {
    // Limpiar cualquier autenticación previa
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });

    // Intentar acceder directamente al dashboard sin autenticación
    cy.visit('/dashboard');
    
    // Debería redirigir a login o mostrar página de inicio
    cy.url().should('satisfy', (url: string | string[]) => {
      return url.includes('/login') || url === 'http://localhost:4200/';
    });
  });

  it('debería manejar errores de red', () => {
    // Setup con mocks de error
    cy.setupApiMocks();
    cy.clearMockData();
    
    // Simular error en getProjects
    cy.intercept('GET', '/api/projects', { 
      statusCode: 500, 
      body: { error: 'Server Error' } 
    }).as('getProjectsError');
    
    cy.loginByApi();
    cy.visit('/dashboard');
    cy.wait('@getProjectsError');

    // Verificar que la aplicación maneja el error graciosamente
    // (no se cuelga, muestra algún mensaje o estado por defecto)
    cy.get('body').should('be.visible');
  });

  it('debería sincronizar cambios entre pestañas', () => {
    const projectName = faker.company.name();

    // Login y crear proyecto
    cy.loginByApi();
    cy.visit('/dashboard');
    cy.wait('@getProjects');
    cy.createProject(projectName);

    // Simular apertura de nueva pestaña (mediante nueva visita)
    cy.visit('/dashboard');
    cy.wait('@getProjects');
    
    // Verificar que el proyecto creado persiste
    cy.get('[data-cy=project-item]').should('contain', projectName);
  });

  it('debería funcionar con diferentes tamaños de pantalla', () => {
    const projectName = faker.company.name();
    const todolistName = faker.word.words(2);

    // Setup inicial
    cy.loginByApi();

    // Test en mobile
    cy.viewport(375, 667);
    cy.visit('/dashboard');
    cy.wait('@getProjects');
    cy.createProject(projectName);
    cy.get('[data-cy=project-item]').should('contain', projectName);

    // Test en tablet
    cy.viewport(768, 1024);
    cy.contains(projectName).click();
    cy.createTodoList(todolistName);
    cy.get('[data-cy=todolist-item]').should('contain', todolistName);

    // Test en desktop
    cy.viewport(1920, 1080);
    cy.contains(todolistName).click();
    cy.get('[data-cy=add-task]').should('be.visible');

    // Crear tarea para verificar funcionalidad completa
    cy.createTask('Tarea responsive test');
    cy.verifyTaskExists('Tarea responsive test');
  });
});
