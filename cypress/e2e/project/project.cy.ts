describe('Validaciones del formulario Nuevo Proyecto (Ejemplo real: Lista de Compras)', () => {
  beforeEach(() => {
    cy.loginByApi()
  });

  /**
   * Test 1: Validación al no ingresar nada
   */
  it('mostrar la validación del nombre al no ingresar nada', () => {
    cy.contains('Nuevo Proyecto').click();
    cy.get('app-project-modal').should('exist');

    cy.get('[data-cy="project-name"]').click();
    cy.get('[data-cy="project-description"]').click();

    cy.contains('El nombre es obligatorio.').should('be.visible');
  });

  /**
   * Test 2: Nombre con una sola palabra (menos de 2 palabras)
   */
  it('mostrar validación si el nombre tiene menos de 2 palabras', () => {
    cy.contains('Nuevo Proyecto').click();
    cy.get('app-project-modal').should('exist');

    cy.get('[data-cy="project-name"]').type('Compras');
    cy.get('[data-cy="project-description"]').click();

    cy.contains('El nombre debe contener al menos 2 palabras').should('be.visible');
  });

  /**
   * Test 3: Nombre con menos de 2 palabras y espacios al inicio/final
   */
  it('mostrar validaciones si el nombre tiene menos de 2 palabras y tiene espacios al inicio o final', () => {
    cy.contains('Nuevo Proyecto').click();
    cy.get('app-project-modal').should('exist');

    cy.get('[data-cy="project-name"]').type(' Lista ');
    cy.get('[data-cy="project-description"]').click();

    cy.contains('El nombre debe contener al menos 2 palabras').should('be.visible');
    cy.contains('El nombre no puede tener espacios al inicio o final').should('be.visible');
  });

  /**
   * Test 4: Descripción con menos de 3 palabras
   */
  it('mostrar validación si la descripción tiene menos de 3 palabras', () => {
    cy.contains('Nuevo Proyecto').click();
    cy.get('app-project-modal').should('exist');

    cy.get('[data-cy="project-name"]').type('Lista de Compras');
    cy.get('[data-cy="project-description"]').type('Lo que');
    cy.get('[data-cy="project-name"]').click(); // Cambiar foco

    cy.contains('La descripción debe tener al menos 3 palabras').should('be.visible');
  });

  /**
   * Test 5: Flujo exitoso - Crear proyecto correctamente con datos válidos (Lista de Compras)
   */
  it('crear un proyecto correctamente con datos válidos (Lista de Compras)', () => {
    cy.contains('Nuevo Proyecto').click();
    cy.get('app-project-modal').should('exist');

    cy.get('[data-cy="project-name"]').type('Lista de Compras');
    cy.get('[data-cy="project-description"]').type('Lo que me falta comprar');

    cy.get('[data-cy="project-submit"]')
      .should('not.be.disabled')
      .click();

    cy.get('app-project-modal').should('not.be.visible');
    cy.contains('Lista de Compras').should('exist');
  });

  /**
   * Test 6: Editar proyecto
   */
  it('editar un proyecto exitosamente (Lista de Compras)', () => {
    cy.get('button[title="Editar proyecto"]').first().click();

    cy.contains('Editar Proyecto').should('be.visible');

    cy.get('[data-cy="project-name"]')
      .clear()
      .type('Lista de compras del mercado');

    cy.get('[data-cy="project-description"]')
      .clear()
      .type('Todo lo que tengo que comprar hoy');

    cy.get('[data-cy="project-submit"]').click();

    cy.contains('Lista de compras del mercado').should('exist');

    // Delete después de editar
    cy.get('button[title="Eliminar proyecto"]').last().click();
    cy.contains('button', 'Eliminar').click();

    cy.contains('Lista de compras del mercado').should('not.exist');
  });
});
