describe('Inicio de sesión', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('debería iniciar sesión con un usuario existente', () => {
    const email = 'testuser1@gmail.com';
    const password = 'Testuser1!';

    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');

  });
});
