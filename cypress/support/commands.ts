export {};

declare global {
  namespace Cypress {
    interface Chainable {
      loginProgrammatically(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginProgrammatically', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/api/auth/login', 
    body: {
      email: 'testuser1@gmail.com',
      password: 'Testuser1!'
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {

    window.localStorage.setItem('jwt', response.body.token);
  });
});