import { faker } from '@faker-js/faker';

describe('Autenticación - Registro', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
    cy.visit('/register');
  });

  describe('Validaciones de formulario', () => {
    it('debería mostrar errores de validación con campos vacíos', () => {
      cy.get('button[type="submit"]').click();
      cy.contains('El nombre de usuario es requerido').should('be.visible');
      cy.contains('El nombre es requerido').should('be.visible');
      cy.contains('El correo electrónico es requerido').should('be.visible');
      cy.contains('La contraseña es requerida').should('be.visible');
      cy.contains('Confirme su contraseña').should('be.visible');
    });

    it('debería validar nombre de usuario con reglas específicas', () => {
      cy.get('[data-cy=register-email]').type(faker.internet.email());
      cy.get('[data-cy=register-password]').type('Test@1234');
      cy.get('[data-cy=register-confirm-password]').type('Test@1234');
      cy.get('[data-cy=register-name]').type(faker.person.fullName());
      cy.get('[data-cy=register-username]').type('ab');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('El nombre de usuario debe tener al menos 3 caracteres').should('be.visible');
      cy.get('[data-cy=register-username]').clear().type('user@invalid');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('Solo se permiten letras, números y guiones bajos').should('be.visible');
    });

    it('debería validar nombre completo con reglas específicas', () => {
      cy.get('[data-cy=register-username]').type(faker.internet.username());
      cy.get('[data-cy=register-email]').type(faker.internet.email());
      cy.get('[data-cy=register-password]').type('Test@1234');
      cy.get('[data-cy=register-confirm-password]').type('Test@1234');
      cy.get('[data-cy=register-name]').type('A');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('El nombre debe tener al menos 2 caracteres').should('be.visible');
      cy.get('[data-cy=register-name]').clear().type('Nombre');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('El nombre debe contener al menos 2 palabras').should('be.visible');
    });

    it('debería validar formato de correo electrónico', () => {
      cy.get('[data-cy=register-username]').type(faker.internet.username());
      cy.get('[data-cy=register-name]').type(faker.person.fullName());
      cy.get('[data-cy=register-password]').type('Test@1234');
      cy.get('[data-cy=register-confirm-password]').type('Test@1234');
      cy.get('[data-cy=register-email]').type('email_invalido');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('Ingrese un correo electrónico válido').should('be.visible');
    });

    it('debería validar fortaleza de contraseña', () => {
      cy.get('[data-cy=register-username]').type(faker.internet.username());
      cy.get('[data-cy=register-name]').type(faker.person.fullName());
      cy.get('[data-cy=register-email]').type(faker.internet.email());
      cy.get('[data-cy=register-password]').type('123');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('La contraseña debe tener al menos 8 caracteres').should('be.visible');
      cy.get('[data-cy=register-password]').clear().type('test@1234');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('La contraseña debe contener al menos una letra mayúscula').should('be.visible');
      cy.get('[data-cy=register-password]').clear().type('Test1234');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('La contraseña debe contener al menos un carácter especial').should('be.visible');
    });

    it('debería validar confirmación de contraseña', () => {
      cy.get('[data-cy=register-username]').type(faker.internet.username());
      cy.get('[data-cy=register-name]').type(faker.person.fullName());
      cy.get('[data-cy=register-email]').type(faker.internet.email());
      cy.get('[data-cy=register-password]').type('Test@1234');
      cy.get('[data-cy=register-confirm-password]').type('Test@4321');
      cy.get('[data-cy=register-submit]').click();
      cy.contains('Las contraseñas no coinciden').should('be.visible');
    });
  });

  describe('Proceso de registro', () => {
    it('debería registrar usuario exitosamente', () => {
      const username = `testuser_${faker.string.alphanumeric(8)}`;
      const name = faker.person.fullName();
      const email = `testuser_${faker.string.alphanumeric(8)}@test.com`;
      const password = 'Test@1234';
      cy.get('[data-cy=register-username]').type(username);
      cy.get('[data-cy=register-name]').type(name);
      cy.get('[data-cy=register-email]').type(email);
      cy.get('[data-cy=register-password]').type(password);
      cy.get('[data-cy=register-confirm-password]').type(password);
      cy.get('[data-cy=register-submit]').click();
      cy.url({ timeout: 5000 }).should('include', '/login');
    });

    it('debería manejar usuario ya existente', () => {
      cy.intercept('POST', 'http://localhost:8080/api/users/register', {
        statusCode: 409,
        body: { message: 'El usuario ya existe' }
      }).as('userExists');
      cy.get('[data-cy=register-username]').type('existinguser');
      cy.get('[data-cy=register-name]').type('Existing User');
      cy.get('[data-cy=register-email]').type('existing@test.com');
      cy.get('[data-cy=register-password]').type('Test@1234');
      cy.get('[data-cy=register-confirm-password]').type('Test@1234');
      cy.get('[data-cy=register-submit]').click();
      cy.url().should('include', '/register');
    });

    it('debería manejar errores del servidor', () => {
      cy.intercept('POST', 'http://localhost:8080/api/users/register', {
        statusCode: 500,
        body: { message: 'Error interno del servidor' }
      }).as('serverError');
      cy.get('[data-cy=register-username]').type(faker.internet.username());
      cy.get('[data-cy=register-name]').type(faker.person.fullName());
      cy.get('[data-cy=register-email]').type(faker.internet.email());
      cy.get('[data-cy=register-password]').type('Test@1234');
      cy.get('[data-cy=register-confirm-password]').type('Test@1234');
      cy.get('[data-cy=register-submit]').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Navegación', () => {
    it('debería navegar a la página de login', () => {
      cy.contains('inicia sesión con tu cuenta existente').click();
      cy.url().should('include', '/login');
    });

    it('debería mostrar/ocultar contraseña', () => {
      cy.get('[data-cy=register-password]').should('have.attr', 'type', 'password');
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="toggle-password"]').length) {
          cy.get('[data-cy="toggle-password"]').click();
          cy.get('[data-cy=register-password]').should('have.attr', 'type', 'text');
        }
      });
    });
  });
});
