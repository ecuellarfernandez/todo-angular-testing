describe('Registro', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/register');
  })
  it('deberia registrar y luego iniciar sesion correctamente', () => {
    const userName = `testuser${Date.now()}`;
    const name = `Test User ${Date.now()}`;
    const email = `testuser${Date.now()}@example.com`;
    const password = '123456';

    cy.get('input[name="username"]').type(userName);
    cy.get('input[name="name"]').type(name);
    cy.get('input[name=email]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');

    }
  );
});
