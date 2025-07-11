describe('Crear ToDoList dentro de un proyecto', () => {
    let projectId: string;
    let projectName: string;

    beforeEach(() => {
        cy.loginByApi();

        const timestamp = Date.now();
        projectName = `Proyecto Cypress ${timestamp}`;

        cy.createProject({
            name: projectName,
            description: `Proyecto Cypress automatico`
        });

        cy.then(() => {
            projectId = Cypress.env('projectId');
        });

        cy.visit('/dashboard');
        cy.contains(projectName).click();
    });

    afterEach(() => {
        if(projectId){
          cy.deleteProject(projectId);
        }
    });

    describe('Apertura del modal', () => {
        it('debería abrir el modal de creación', () => {
            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="todolist-title"]').should('be.visible');
            cy.get('[data-cy="submit-todolist"]').should('be.visible');
            cy.contains('Nueva Lista de Tareas').should('be.visible');
        });

        it('debería cerrar el modal al hacer clic en cancelar', () => {
            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="cancel-todolist"]').click();
            cy.get('[data-cy="todolist-title"]').should('not.exist');
        });

        it('debería cerrar el modal al hacer clic en la X', () => {
            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="close-modal"]').click();
            cy.get('[data-cy="todolist-title"]').should('not.exist');
        });
    });

    describe('Validaciones del formulario', () => {
        beforeEach(() => {
            cy.get('[data-cy="add-todolist"]').click();
        });

        it('debería mantener el botón deshabilitado si el título está vacío', () => {
            cy.get('[data-cy="submit-todolist"]').should('be.disabled');
        });

        it('debería mostrar error cuando el campo está vacío y se pierde el foco', () => {
            cy.get('[data-cy="todolist-title"]').focus().blur();
            cy.contains('El nombre es obligatorio.').should('be.visible');
            cy.get('[data-cy="submit-todolist"]').should('be.disabled');
        });

        it('debería mostrar error cuando el nombre tiene menos de 2 palabras', () => {
            cy.get('[data-cy="todolist-title"]').type('Tarea').blur();
            cy.contains('El nombre debe contener al menos 2 palabras.').should('be.visible');
            cy.get('[data-cy="submit-todolist"]').should('be.disabled');
        });

        it('debería mostrar error cuando el nombre tiene espacios al inicio o final', () => {
            cy.get('[data-cy="todolist-title"]').type(' Mi lista de tareas ').blur();
            cy.contains('El nombre no puede tener espacios al inicio o final.').should('be.visible');
            cy.get('[data-cy="submit-todolist"]').should('be.disabled');
        });

        it('debería mostrar error cuando el nombre excede 100 caracteres', () => {
            const longText = 'a'.repeat(101);
            cy.get('[data-cy="todolist-title"]').type(longText).blur();
            cy.contains('El nombre no puede tener más de 100 caracteres.').should('be.visible');
            cy.get('[data-cy="submit-todolist"]').should('be.disabled');
        });

        it('debería habilitar el botón cuando el campo es válido', () => {
            cy.get('[data-cy="todolist-title"]').type('Mi lista tareas');
            cy.get('[data-cy="submit-todolist"]').should('not.be.disabled');
        });

        it('debería validar múltiples errores simultáneamente', () => {
            cy.get('[data-cy="todolist-title"]').type(' Tarea ').blur();
            cy.contains('El nombre debe contener al menos 2 palabras.').should('be.visible');
            cy.contains('El nombre no puede tener espacios al inicio o final.').should('be.visible');
        });

        it('debería limpiar errores cuando se corrige el input', () => {
            // Primero generar un error
            cy.get('[data-cy="todolist-title"]').type('Tarea').blur();
            cy.contains('El nombre debe contener al menos 2 palabras.').should('be.visible');

            // Luego corregir
            cy.get('[data-cy="todolist-title"]').clear().type('Mi lista tareas');
            cy.contains('El nombre debe contener al menos 2 palabras.').should('not.exist');
            cy.get('[data-cy="submit-todolist"]').should('not.be.disabled');
        });
    });

    describe('Creación de ToDoList', () => {
        it('debería permitir crear una ToDoList válida y visualizarla', () => {
            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="todolist-title"]').type('Mi lista de tareas');
            cy.get('[data-cy="submit-todolist"]').click();

            // Validar que el modal se cierre
            cy.get('[data-cy="todolist-title"]').should('not.exist');

            // Validar que la lista aparezca en el proyecto
            cy.contains('Mi lista de tareas').should('be.visible');
        });

        it('debería crear múltiples ToDoLists en el mismo proyecto', () => {
            const todoLists = ['Lista de compras', 'Tareas del hogar', 'Proyectos personales'];

            todoLists.forEach((listName, index) => {
                cy.get('[data-cy="add-todolist"]').click();
                cy.get('[data-cy="todolist-title"]').type(listName);
                cy.get('[data-cy="submit-todolist"]').click();

                // Esperar a que se cierre el modal antes de continuar
                cy.get('[data-cy="todolist-title"]').should('not.exist');

                // Validar que la lista aparezca
                cy.contains(listName).should('be.visible');
            });

            // Validar que todas las listas estén presentes
            todoLists.forEach(listName => {
                cy.contains(listName).should('be.visible');
            });
        });

        it('debería manejar caracteres especiales en el nombre', () => {
            const specialName = 'Lista con áéíóú ñ & símbolos!';
            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="todolist-title"]').type(specialName);
            cy.get('[data-cy="submit-todolist"]').click();

            cy.contains(specialName).should('be.visible');
        });

        it('debería manejar nombres en el límite de caracteres permitidos', () => {
            const maxLengthName = 'Lista de tareas con exactamente noventa y nueve caracteres para probar el límite máximo';
            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="todolist-title"]').type(maxLengthName);
            cy.get('[data-cy="submit-todolist"]').should('not.be.disabled');
            cy.get('[data-cy="submit-todolist"]').click();

            cy.contains(maxLengthName).should('be.visible');
        });
    });

    describe('Comportamiento del formulario', () => {
        it('debería resetear el formulario al cerrar y reabrir el modal', () => {
            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="todolist-title"]').type('Texto temporal');
            cy.get('[data-cy="cancel-todolist"]').click();

            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="todolist-title"]').should('have.value', '');
            cy.get('[data-cy="submit-todolist"]').should('be.disabled');
        });

        it('debería mantener el foco en el campo de entrada al abrir el modal', () => {
            cy.get('[data-cy="add-todolist"]').click();
            cy.get('[data-cy="todolist-title"]').should('be.visible');
            // Verificar que se puede escribir inmediatamente
            cy.get('[data-cy="todolist-title"]').type('Test inmediato');
            cy.get('[data-cy="todolist-title"]').should('have.value', 'Test inmediato');
        });
    });
});
