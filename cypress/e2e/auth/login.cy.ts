import { faker } from '@faker-js/faker';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD, API_URL } from '../../support/commands';

describe('Autenticación - Login', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
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
      cy.get('[data-cy=login-email]').type(invalidEmail);
      cy.get('[data-cy=login-submit]').click();
      cy.contains('El formato del correo electrónico no es válido').should('be.visible');
      cy.contains('El correo electrónico no tiene un formato válido').should('be.visible');
      const invalidEmailWithDomain = 'usuario@dominio';
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
      cy.get('[data-cy=login-email]').type(TEST_USER_EMAIL);
      cy.get('[data-cy=login-password]').type(TEST_USER_PASSWORD);
      cy.get('[data-cy=login-submit]').click();
      cy.url({ timeout: 5000 }).should('include', '/dashboard');
      cy.contains('Panel de').should('be.visible');
    });

    it('debería manejar credenciales incorrectas', () => {
      cy.intercept('POST', `${API_URL}/auth/login`, {
        statusCode: 401,
        body: { message: 'Credenciales inválidas' }
      }).as('loginError');
      const email = faker.internet.email();
      const password = 'password_incorrecta';
      cy.get('[data-cy=login-email]').type(email);
      cy.get('[data-cy=login-password]').type(password);
      cy.get('[data-cy=login-submit]').click();
      cy.contains('Credenciales inválidas').should('be.visible');
    });

    it('debería manejar errores de servidor', () => {
      cy.intercept('POST', `${API_URL}/auth/login`, {
        statusCode: 500,
        body: { message: 'Error interno del servidor' }
      }).as('serverError');
      const email = faker.internet.email();
      const password = faker.internet.password();
      cy.get('[data-cy=login-email]').type(email);
      cy.get('[data-cy=login-password]').type(password);
      cy.get('[data-cy=login-submit]').click();
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
