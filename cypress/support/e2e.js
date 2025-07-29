// cypress/support/e2e.js
// Import commands.js using ES2015 syntax:
import './commands'
// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // You might want to log the error or handle specific errors
  console.error('Uncaught exception:', err);
  return false;
});

// Custom commands for common operations
Cypress.Commands.add('login', (username = 'admin', password = 'password') => {
  cy.visit('/');
  cy.get('[data-testid="username-input"]').type(username);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.contains(`Welcome, ${username}!`).should('be.visible');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
  cy.get('[data-testid="login-form"]').should('be.visible');
});

Cypress.Commands.add('createTodo', (title) => {
  cy.get('[data-testid="new-todo-input"]').type(title);
  cy.get('[data-testid="add-todo-button"]').click();
  cy.contains(title).should('be.visible');
});

Cypress.Commands.add('deleteTodo', (title) => {
  cy.contains(title).parents('[data-testid^="todo-item-"]').within(() => {
    cy.get('[data-testid^="delete-button-"]').click();
  });
});

Cypress.Commands.add('editTodo', (oldTitle, newTitle) => {
  cy.contains(oldTitle).parents('[data-testid^="todo-item-"]').within(() => {
    cy.get('[data-testid^="edit-button-"]').click();
    cy.get('[data-testid^="edit-todo-input-"]').clear().type(newTitle);
    cy.get('[data-testid^="save-edit-button-"]').click();
  });
  cy.contains(newTitle).should('be.visible');
});

Cypress.Commands.add('toggleTodo', (title) => {
  cy.contains(title).parents('[data-testid^="todo-item-"]').within(() => {
    cy.get('[data-testid^="todo-checkbox-"]').click();
  });
});

// API testing helpers
Cypress.Commands.add('apiLogin', (username = 'admin', password = 'password') => {
  return cy.request({
    method: 'POST',
    url: '/api/auth/login', // Add your actual login endpoint
    body: {
      username: username,
      password: password
    }
  }).then((response) => {
    // Store the token or session data if needed
    if (response.body.token) {
      window.localStorage.setItem('authToken', response.body.token);
    }
    return response;
  });
});