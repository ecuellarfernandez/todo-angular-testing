describe('Inicio de sesión', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('mostrar las validaciones al dejar los campos vacíos', () => {
    cy.get('[data-cy="login-submit"]').click();

    cy.contains('El correo electrónico es requerido').should('be.visible');
    cy.contains('La contraseña es requerida').should('be.visible');
  });


  it('mostrar error si el formato del correo es inválido', () => {
  // Sin @
  cy.get('[data-cy="login-email"]').type('andres');
  cy.get('[data-cy="login-submit"]').click();

  cy.contains('El formato del correo electrónico no es válido').should('be.visible');
  cy.contains('El correo electrónico no tiene un formato válido').should('be.visible');

  // Con @ pero sin dominio (.com, .es, etc.)
  cy.get('[data-cy="login-email"]').clear().type('andres@gmail');
  cy.get('[data-cy="login-submit"]').click();

  cy.contains('El correo electrónico no tiene un formato válido').should('be.visible');
  });

  it('mostrar error si el correo es válido pero la contraseña está vacía', () => {
    cy.get('[data-cy="login-email"]').type('andreslopez@gmail.com');
    cy.get('[data-cy="login-submit"]').click();

    cy.contains('La contraseña es requerida').should('be.visible');
  });

  it('mostrar un error al ingresar una contraseña incorrecta', () => {
    const email = 'andreslopez@gmail.com';
    const passwordIncorrecta = 'ClaveIncorrecta123!';

    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(passwordIncorrecta);
    cy.get('[data-cy="login-submit"]').click();

    cy.contains('Credenciales inválidas').should('be.visible');
  });

  it('iniciar sesión con un usuario existente', () => {
    const email = 'andreslopez@gmail.com';
    const password = 'AndresLopez123!';

    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should('include', '/dashboard');
});
});
