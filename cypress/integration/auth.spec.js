describe('Auth Flow', () => {
    it('should allow a user to sign up', () => {
      cy.visit('/signup');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/invitations');
      cy.get('h2').should('contain', 'Invitaciones');
    });
  
    it('should allow a user to log in', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      
      cy.url().should('include', '/invitations');
      cy.get('h2').should('contain', 'Invitaciones');
    });
  
    // Similar tests for logout, password recovery
  });
  