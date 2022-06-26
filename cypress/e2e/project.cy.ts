import slugify from 'slugify'
import Chance from "chance"

const chance = new Chance()
let user: [string, string]

describe('Project CRUD', () => {
  before(() => {
    cy.createUser().then(([email, password]) => user = [email, password])
    cy.logout()
  })

  beforeEach(() => cy.loginWithPassword(...user))

  it('can add a new project', () => {
    const newProject = chance.sentence({ words: 2 })

    cy.getByTestId('add-project').click()
    cy.getByTestId('project-form').get('input[type="text"]').type(`${newProject}{enter}`)

    cy.getByTestId('project-list').contains(newProject).should('be.visible')
  })

  context('with existing project', () => {
    let currentProject: string

    beforeEach(() => {
      currentProject = chance.sentence({ words: 2 })

      cy.getByTestId('add-project').click()
      cy.getByTestId('project-form').get('input[type="text"]').type(`${currentProject}{enter}`)
    })

    it('can soft-delete & restore project', () => {
      cy
        .getByTestId('project-list')
        .contains(currentProject)
        .within(element => {
          cy.wrap(element)
            .getByTestId('delete-project')
            .click({ force: true })
        })

      // Should be removed from project-list
      cy
        .getByTestId('project-list')
        .contains(currentProject)
        .should('not.exist')

      cy.getByTestId('toggle-show-deleted').click()

      // Shoudl be visible on the deleted-project-list
      cy
        .getByTestId('deleted-project-list')
        .contains(currentProject)
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
        .contains(currentProject)
        .should('not.exist')

      // After restoring should be back on the project-list
      cy
        .getByTestId('project-list')
        .contains(currentProject)
        .should('be.visible')
    })

    it('can go to project\'s page on click', () => {
      // Right after a project is created we are redirected to the project's page.
      // Revert this visiting '/' and then that we are redirected by clicking
      // 'project-list` item
      cy.visit('/')

      cy.location('pathname').should('not.contain', slugify(currentProject, { strict: true }))
      cy.getByTestId('project-list').contains(currentProject).click()
      cy.location('pathname').should('contain', slugify(currentProject, { strict: true }))
    })

    it('can edit project\'s title', () => {
      const newTitle = chance.sentence({ words: 3 })

      cy.getByTestId('project-list').contains(currentProject).click()

      cy.location('pathname').should('contain', slugify(currentProject, { strict: true }))

      cy.getByTestId('title-form') // Get the content editable title
        .contains(currentProject) // Target the preview
        .click() // Click to enter edit mode
        .focused() // Get the focues element, whitch should be the content editable input
        .clear() // Remove previous title
        .type(`${newTitle}{enter}`) // Enter new title

      // The pathname should have changed
      cy.location('pathname').should('contain', slugify(newTitle, { strict: true }))

      // The project item on the sidebar should update too
      cy.getByTestId('project-list').should('not.contain.text', currentProject)
      cy.getByTestId('project-list').should('contain.text', newTitle)
    })
  })
})
