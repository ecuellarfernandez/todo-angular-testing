import './commands'
import './api-mocks'

beforeEach(() => {
  cy.setupApiMocks();
  cy.clearMockData();
});
