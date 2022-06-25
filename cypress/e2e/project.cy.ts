import slugify from 'slugify'
import Chance from "chance"

const chance = new Chance()
let user: [string, string]

describe('Project CRUD', () => {
  before(() => cy.createUser().then(([email, password]) => user = [email, password]))

  beforeEach(() => {
    cy.logout()
    cy.loginWithPassword(...user)
  })

  it('can add a new project', () => {
    const newProject = chance.sentence({ words: 2 })

    cy.getByTestId('add-project').click()
    cy.getByTestId('project-form').get('input[type="text"]').type(`${newProject}{enter}`)

    cy.getByTestId('project-list').contains(newProject).should('be.visible')
  })

  it('can soft-delete & restore project', () => {
    const newProject = chance.sentence({ words: 2 })

    cy.getByTestId('add-project').click()
    cy.getByTestId('project-form').get('input[type="text"]').type(`${newProject}{enter}`)

    cy
      .getByTestId('project-list')
      .contains(newProject)
      .within(element => {
        cy.wrap(element)
          .getByTestId('delete-project')
          .click({ force: true })
      })

    // Should be removed from project-list
    cy
      .getByTestId('project-list')
      .contains(newProject)
      .should('not.exist')

    cy.getByTestId('toggle-show-deleted').click()

    // Shoudl be visible on the deleted-project-list
    cy
      .getByTestId('deleted-project-list')
      .contains(newProject)
      .should('be.visible')
      // Restore it
      .within(element => {
        cy
          .wrap(element)
          .getByTestId('restore-project')
          .click({ force: true })
      })

    cy
      .getByTestId('deleted-project-list')
      .contains(newProject)
      .should('not.exist')

    // After restoring should be back on the project-list
    cy
      .getByTestId('project-list')
      .contains(newProject)
      .should('be.visible')
  })

  it('can go to project\'s page on click', () => {
    const newProject = chance.sentence({ words: 2 })

    cy.getByTestId('add-project').click()
    cy.getByTestId('project-form').get('input[type="text"]').type(`${newProject}{enter}`)

    cy.location('pathname').should('not.contain', slugify(newProject))
    cy.getByTestId('project-list').contains(newProject).click()
    cy.location('pathname').should('contain', slugify(newProject))
  })

  it('can edit project\'s title')
})
