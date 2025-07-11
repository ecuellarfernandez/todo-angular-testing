describe('Registro de usuario', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/register');
  });

  /**
   * Test 1: Campos vacíos
   */
  it('mostrar los mensajes de error al dejar todos los campos vacíos', () => {
    cy.get('button[type="submit"]').click();

    cy.contains('El nombre de usuario es requerido').should('be.visible');
    cy.contains('El nombre es requerido').should('be.visible');
    cy.contains('El correo electrónico es requerido').should('be.visible');
    cy.contains('La contraseña es requerida').should('be.visible');
    cy.contains('Confirme su contraseña').should('be.visible');
  });

  /**
   * Test 2: Nombre de usuario con menos de 3 caracteres y caracteres inválidos
   */
  it('mostrar error si el nombre de usuario es muy corto o inválido', () => {
    cy.get('input[name="username"]').type('a');
    cy.get('button[type="submit"]').click();

    cy.contains('El nombre de usuario debe tener al menos 3 caracteres').should('be.visible');
    cy.contains('Solo se permiten letras, números y guiones bajos').should('be.visible');
  });

  /**
   * Test 3: Nombre completo con menos de 2 caracteres o 1 sola palabra
   */
  it('mostrar error si el nombre completo es muy corto o tiene menos de 2 palabras', () => {
    cy.get('input[name="username"]').type('andres');
    cy.get('input[name="name"]').type('a');
    cy.get('button[type="submit"]').click();

    cy.contains('El nombre debe tener al menos 2 caracteres').should('be.visible');
    cy.contains('El nombre debe contener al menos 2 palabras').should('be.visible');
  });

  /**
   * Test 4: Correo electrónico inválido
   */
  it('mostrar error si el correo electrónico es inválido', () => {
    cy.get('input[name="username"]').type('andres');
    cy.get('input[name="name"]').type('Andres Lopez');

    // Primer intento: sin @
    cy.get('input[name="email"]').type('andlopez');
    cy.get('button[type="submit"]').click();

    cy.contains('Ingrese un correo electrónico válido').should('be.visible');
    cy.contains('El correo electrónico no tiene un formato válido').should('be.visible');

    // Segundo intento: con @ pero sin dominio (.com, .es, etc.)
    cy.get('input[name="email"]').clear().type('andlopez@gmail');
    cy.get('button[type="submit"]').click();

    cy.contains('El correo electrónico no tiene un formato válido').should('be.visible');
  });



  /**
   * Test 5: Correo válido pero contraseñas vacías
   */
  it('mostrar error si las contraseñas están vacías', () => {
    cy.get('input[name="username"]').type('andres');
    cy.get('input[name="name"]').type('Andres Lopez');
    cy.get('input[name="email"]').type('andres@gmail.com');
    cy.get('button[type="submit"]').click();

    cy.contains('La contraseña es requerida').should('be.visible');
    cy.contains('Confirme su contraseña').should('be.visible');
  });

  /**
   * Test 6: Contraseña que no cumple requisitos
   */
  it('mostrar error si la contraseña no cumple requisitos', () => {
    cy.get('input[name="username"]').type('andres');
    cy.get('input[name="name"]').type('Andres Lopez');
    cy.get('input[name="email"]').type('andres@gmail.com');
    cy.get('input[name="password"]').type('a');
    cy.get('button[type="submit"]').click();

    cy.contains('La contraseña debe tener al menos 8 caracteres').should('be.visible');
    cy.contains('La contraseña debe contener al menos una letra mayúscula').should('be.visible');
    cy.contains('La contraseña debe contener al menos un número').should('be.visible');
    cy.contains('La contraseña debe contener al menos un carácter especial').should('be.visible');
    cy.contains('Las contraseñas no coinciden').should('be.visible');
  });

  /**
   * Test 7: Contraseñas que no coinciden
   */
  it('mostrar error si las contraseñas no coinciden', () => {
    cy.get('input[name="username"]').type('andres');
    cy.get('input[name="name"]').type('Andres Lopez');
    cy.get('input[name="email"]').type('andres@gmail.com');
    cy.get('input[name="password"]').type('Test@1234');
    cy.get('input[name="confirmPassword"]').type('Test@12345');
    cy.get('button[type="submit"]').click();

    cy.contains('Las contraseñas no coinciden').should('be.visible');
  });

  /**
   * Test 8: Registro exitoso con datos válidos
   */
  it('registrar y luego iniciar sesión correctamente', () => {
    const userName = `andres${Date.now()}`.slice(0, 20);
    const name = 'Andres Lopez';
    const email = `andres${Date.now()}@gmail.com`;
    const password = 'Test@1234';

    cy.get('input[name="username"]').type(userName);
    cy.get('input[name="name"]').type(name);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirmPassword"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');
  });
});
