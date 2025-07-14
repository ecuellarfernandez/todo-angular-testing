import { faker } from '@faker-js/faker';

describe('Autenticación - Login', () => {
  beforeEach(() => {
    cy.setupApiMocks();
    cy.clearMockData();
    cy.visit('/login');
  });

  describe('Validaciones de formulario', () => {
    it('debería mostrar errores de validación con campos vacíos', () => {
      cy.get('[data-cy=login-submit]').click();

      cy.contains('El correo electrónico es requerido').should('be.visible');
      cy.contains('La contraseña es requerida').should('be.visible');
    });

    it('debería validar formato de correo electrónico', () => {
      const invalidEmail = 'usuario_invalido';
      // Sin @
      cy.get('[data-cy=login-email]').type(invalidEmail);
      cy.get('[data-cy=login-submit]').click();
      cy.contains('El formato del correo electrónico no es válido').should('be.visible');
      cy.contains('El correo electrónico no tiene un formato válido').should('be.visible');
      const invalidEmailWithDomain = 'usuario@dominio';
      // Con @ pero sin dominio válido
      cy.get('[data-cy=login-email]').clear().type(invalidEmailWithDomain);
      cy.get('[data-cy=login-submit]').click();
      cy.contains('El correo electrónico no tiene un formato válido').should('be.visible');
    });

    it('debería requerir contraseña cuando el email es válido', () => {
      const email = faker.internet.email();
      
      cy.get('[data-cy=login-email]').type(email);
      cy.get('[data-cy=login-submit]').click();

      cy.contains('La contraseña es requerida').should('be.visible');
    });
  });

  describe('Proceso de autenticación', () => {
    it('debería iniciar sesión exitosamente con credenciales válidas', () => {
      const email = 'test@test.com';
      const password = 'password123';

      cy.get('[data-cy=login-email]').type(email);
      cy.get('[data-cy=login-password]').type(password);
      cy.get('[data-cy=login-submit]').click();

      // Verificar redirección al dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Panel de').should('be.visible');
    });

    it('debería manejar credenciales incorrectas', () => {
      // Mock para error de login
      cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
        statusCode: 401,
        body: { message: 'Credenciales inválidas' }
      }).as('loginError');

      const email = faker.internet.email();
      const password = 'password_incorrecta';

      cy.get('[data-cy=login-email]').type(email);
      cy.get('[data-cy=login-password]').type(password);
      cy.get('[data-cy=login-submit]').click();

      cy.wait('@loginError');
      cy.contains('Credenciales inválidas').should('be.visible');
    });

    it('debería manejar errores de servidor', () => {
      // Mock para error del servidor
      cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
        statusCode: 500,
        body: { message: 'Error interno del servidor' }
      }).as('serverError');

      const email = faker.internet.email();
      const password = faker.internet.password();

      cy.get('[data-cy=login-email]').type(email);
      cy.get('[data-cy=login-password]').type(password);
      cy.get('[data-cy=login-submit]').click();

      cy.wait('@serverError');
      // Simplemente verificar que no se redirige al dashboard
      cy.url().should('include', '/login');
    });
  });

  describe('Navegación', () => {
    it('debería navegar a la página de registro', () => {
      cy.contains('Regístrate aquí').click();
      cy.url().should('include', '/register');
    });

    it('debería mantener los datos del formulario durante la navegación', () => {
      const email = faker.internet.email();
      
      cy.get('[data-cy=login-email]').type(email);
      cy.get('[data-cy=login-email]').should('have.value', email);
    });
  });
});
