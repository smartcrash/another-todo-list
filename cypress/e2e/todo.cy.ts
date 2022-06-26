import Chance from "chance"

const chance = new Chance()

let user: [string, string]
let projectTitle = chance.sentence({ words: 2 })

describe('Todo CRUD', () => {
  // Before all tests create an user and a project to test on
  before(() => {
    cy.createUser().then(([email, password]) => user = [email, password])
    cy.getByTestId('add-project').click()
    cy.getByTestId('project-form').get('input[type="text"]').type(`${projectTitle}{enter}`)
    cy.logout()
  })

  // Before each test login as the test user and go to the project's page
  beforeEach(() => {
    cy.loginWithPassword(...user)
    cy.getByTestId('project-list').contains(projectTitle).click()
  })


  it('can add new todo items', () => {
    const newItem = chance.sentence({ words: 5 })

    cy.getByTestId('add-todo').click()
    cy.getByTestId('todo-form').get('input[type="text"]').type(`${newItem}{enter}`)

    cy.getByTestId('todo-item')
      .should('have.length', 1)
      .last()
      .should('contain.text', newItem)
  })

  context('with an existing task', () => {
    let currentItem: string

    beforeEach(() => {
      currentItem = chance.sentence({ words: 5 })

      cy.getByTestId('add-todo').click()
      cy.getByTestId('todo-form').get('input[type="text"]').type(`${currentItem}{enter}`)
    })

    it('can check off an item as completed', () => {
      cy.contains(currentItem)
        .closest('[data-testid="todo-item"]')
        .find('input[type=checkbox]')
        .check({ force: true })

      cy.contains(currentItem)
        .should('have.css', 'text-decoration')
        .and('match', /line-through/)
    })

    it('can update item content', () => {
      const newContent = chance.sentence({ words: 3 })

      cy.getByTestId('todo-item')
        .last()
        .should('contain.text', currentItem)
        .contains(currentItem)
        .click()
        .focused()
        .clear()
        .type(`${newContent}{enter}`)

      cy.getByTestId('todo-item')
        .last()
        .should('contain.text', newContent)
    })

    it('can delete task', () => {
      cy.getByTestId('todo-item')
        .last()
        .should('contain.text', currentItem)
        .within(element => {
          cy.wrap(element)
            .getByTestId('delete-todo')
            .click({ force: true })
        })

      cy.getByTestId('todo-list')
        .should('not.contain.text', currentItem)
    })
  })

  context('with a task marked as finished', () => {
    let currentItem: string

    beforeEach(() => {
      currentItem = chance.sentence({ words: 5 })

      cy.getByTestId('add-todo').click()
      cy.getByTestId('todo-form').get('input[type="text"]').type(`${currentItem}{enter}`)

      cy.contains(currentItem)
        .closest('[data-testid="todo-item"]')
        .find('input[type=checkbox]')
        .check({ force: true })
    })

    it('can not un-check item as completed', () => {
      cy.contains(currentItem)
        .closest('[data-testid="todo-item"]')
        .find('input[type=checkbox]')
        .should('have.attr', 'disabled', 'disabled')
    })

    it('can not update the task', () => {
      cy.getByTestId('todo-item')
        .last()
        .should('contain.text', currentItem)
        .contains(currentItem)
        // This element should be un-clickable, so you can not enter edit on mode
        .should('have.css', 'pointer-events', 'none')
    })

    it('can not delete the task', () => {
      cy.getByTestId('todo-item')
        .last()
        .should('contain.text', currentItem)
        .within(element => {
          cy.wrap(element)
            .getByTestId('delete-todo')
            // NOTE: The delete button still exists but is hidden
            .click({ force: true })
        })

      // The task show be visible
      cy.getByTestId('todo-list')
        .should('contain.text', currentItem)
    })
  })

  it('can hide completed tasks', () => {
    const unCheckedTask = chance.word()
    const checkedTask = chance.word();

    cy.getByTestId('add-todo').click();

    // Create 3 tasks
    ;[unCheckedTask, checkedTask].forEach((newItem) => {
      cy.getByTestId('todo-form')
        .get('input[type="text"]')
        .clear()
        .type(`${newItem}{enter}`)
    })

    cy.getByTestId('todo-item').should('have.length.at.least', 2)

    cy.contains(checkedTask)
      .closest('[data-testid="todo-item"]')
      .find('input[type=checkbox]')
      .check({ force: true })


    cy.getByTestId('toggle-show-completed').click()

    // After filtering, we can assert that there is only the one
    // complete item in the list.
    cy.getByTestId('todo-item')
      .should('have.length.at.least', 1)

    // Unc-checked task should still be visible
    cy.contains(unCheckedTask).should('be.visible')

    // The task that was checked off should not exists
    cy.contains(checkedTask).should('not.exist')

    // Now toggle back and check that all items are in the list again

    cy.getByTestId('toggle-show-completed').click()

    cy.getByTestId('todo-item')
      .should('have.length.at.least', 2)

    // Now both tasks should be visible again
    cy.contains(unCheckedTask).should('be.visible')
    cy.contains(checkedTask).should('be.visible')
  })
})
