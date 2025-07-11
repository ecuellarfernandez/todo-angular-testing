declare namespace Cypress {
  interface Chainable {
    loginByApi(): Chainable<void>;
    createProject(args: { name: string; description: string }): Chainable<void>;
    deleteProject(projectId: string): Chainable<void>;
    createTodoList(args: { projectId: string | (() => string); name: string }): Chainable<void>;
    deleteTodoList(projectId: string, todoListId: string): Chainable<void>;
    createTask(args: {projectId: string | (() => string);
                      todoListId: string | (() => string);
                      title: string;
                      description: string;
                      dueDate?: string;
    }): Chainable<void>
  }
}
const apiUrl = Cypress.env('apiUrl');

Cypress.Commands.add('loginByApi', () => {
    cy.request('POST', `${apiUrl}/api/auth/login`,{
        email: 'test@test.com',
        password: 'Test@test1'
    }).then((res)=>{
        const token = res.body.token;
        if(!token){
            throw new Error('No se pudo obtener el token de autenticación');
        }

        cy.visit('/dashboard',{
            onBeforeLoad(win){
                win.localStorage.setItem('jwt', token)
            }
        })
    });
});

Cypress.Commands.add(
  'createProject',
  ({name, description}: {name:string; description:string}) => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem('jwt');
      if(!token){
        throw new Error('No se pudo obtener el token de autenticación');
      }
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/projects`,
        body: { name, description },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((resp) => {
        Cypress.env('projectId', resp.body.id);
        Cypress.env('projectName', resp.body.name);
      });
    });
  }
);

Cypress.Commands.add(
  'deleteProject',
  (projectId: string) => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem('jwt');
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/api/projects/${projectId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    });
  }
);

Cypress.Commands.add(
  'createTodoList',
  ({projectId, name}: {projectId: string | (() => string); name: string}) => {
    const resolvedProjectId = typeof projectId === 'function' ? projectId() : projectId;
    cy.window().then((win) => {
      const token = win.localStorage.getItem('jwt');
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/projects/${resolvedProjectId}/todolists`,
        body: { name },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((resp) => {
        Cypress.env('todoListId', resp.body.id);
        Cypress.env('todoListName', resp.body.name);
      });
    });
  }
);

Cypress.Commands.add(
  'deleteTodoList',
  (projectId: string, todoListId: string) => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem('jwt');
      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/api/projects/${projectId}/todolists/${todoListId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    });
  }
);

