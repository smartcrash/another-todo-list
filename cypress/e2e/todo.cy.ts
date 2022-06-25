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

  it.only('can hide completed tasks', () => {
    // Remove any existing task to have a clean state
    cy.document().then(($document) => {
      if ($document.querySelectorAll('[data-testid="delete-todo"]').length) {
        cy.getByTestId('delete-todo').click({ force: true, multiple: true })
        cy.getByTestId('todo-item').should('have.length', 1);
      }
    });

    const tasks = [
      chance.word(),
      chance.word(),
    ]

    // Create 3 tasks
    tasks.forEach((newItem) => {
      cy.getByTestId('add-todo').click()
      cy.getByTestId('todo-form').get('input[type="text"]').type(`${newItem}{enter}`)
    })

    cy.getByTestId('todo-item')
      .should('have.length', 2)
      .last()
      .closest('[data-testid="todo-item"]')
      .find('input[type=checkbox]')
      .check({ force: true });


    cy.getByTestId('toggle-show-completed').click()

    // After filtering, we can assert that there is only the one
    // complete item in the list.
    cy.getByTestId('todo-item')
      .should('have.length', 1)
      .first()
      .should('contain.text', tasks[0])

    // For good measure, let's also assert that the task we checked off
    // does not exist on the page.
    cy.contains(tasks[1]).should('not.exist')

    // Now toggle back and check that all items are in the list again

    cy.getByTestId('toggle-show-completed').click()

    cy.getByTestId('todo-item')
      .should('have.length', 2)

    cy.contains(tasks[0]).should('be.visible')
    cy.contains(tasks[1]).should('be.visible')
  })
})
