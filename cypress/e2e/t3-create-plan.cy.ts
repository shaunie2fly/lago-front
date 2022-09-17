describe('Create plan', () => {
  beforeEach(() => {
    cy.login('usertest@lago.com', 'P@ssw0rd')
    cy.visit('/plans')
  })

  // it('should be able to access plans', () => {
  //   cy.get('[data-test="create-plan"]').should('exist')
  //   cy.get('[data-test="empty"]').should('exist')
  // })

  it('should be able to create a simple plan', () => {
    const randomId = Math.round(Math.random() * 1000)
    const planName = `plan ${randomId}`

    cy.get('[data-test="create-plan"]').click()
    cy.url().should('be.equal', Cypress.config().baseUrl + '/create/plans')
    cy.get('input[name="name"]').type(planName)
    cy.get('input[name="code"]').type(planName)
    cy.get('textarea[name="description"]').type('I am a description')
    cy.get('input[name="amountCents"]').type('30000')
    cy.get('[data-test="submit"]').click()
    cy.get('[data-test="go-back"]').click()
    cy.url().should('be.equal', Cypress.config().baseUrl + '/plans')
    cy.contains(planName).should('exist')
  })
})
