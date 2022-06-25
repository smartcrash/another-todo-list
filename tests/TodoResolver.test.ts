import { faker } from "@faker-js/faker"
import { test } from "@japa/runner"
import { SESSION_COOKIE } from "../source/constants"
import { ProjectFactory, TodoFactory, UserFactory } from "../source/factories"
import { ProjectRepository, TodoRepository } from "../source/repository"
import { assertIsForbiddenExeption, testThrowsIfNotAuthenticated } from "../source/utils/testUtils"

const AddTodoMutation = `
  mutation AddTodo($projectId: Int!, $content: String!) {
    todo: addTodo(projectId: $projectId, content: $content) {
      id
      content
      completed
    }
  }
`

const UpdateTodoMutation = `
  mutation UpdateTodo($id: Int!, $content: String, $completed: Boolean) {
    todo: updateTodo(id: $id, content: $content, completed: $completed) {
      id
      content
      completed
    }
  }
`

const RemoveTodoMutation = `
  mutation RemoveTodo($id: Int!) {
    id: removeTodo(id: $id)
  }
`

test.group('addTodo', () => {
  testThrowsIfNotAuthenticated({
    query: AddTodoMutation,
    variables: { content: '', projectId: 0 }
  })

  test('add todo', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const project = await ProjectFactory.create({ user })

    const content = faker.lorem.words()

    const queryData = {
      query: AddTodoMutation,
      variables: { content, projectId: project.id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(typeof data.todo.id).toBe('number')
    expect(data.todo.content).toBe(content)
    expect(data.todo.completed).toBe(false)

    // Assert that was related to the correct project
    const { projectId } = await TodoRepository.findOneBy({ id: data.todo.id })
    expect(projectId).toBe(project.id)
  })

  test('can not add a todo to someone else\'s project', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [, cookie] = await createUser(client)
    const project = await ProjectFactory.create({ user: otherUser })

    const queryData = {
      query: AddTodoMutation,
      variables: {
        content: faker.lorem.words(),
        projectId: project.id,
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const { todos } = await ProjectRepository.findOne({
      where: { id: project.id },
      relations: { todos: true }
    })

    expect(todos).toHaveLength(0)
  })
})

test.group('updateTodo', () => {
  testThrowsIfNotAuthenticated({
    query: UpdateTodoMutation,
    variables: { content: '', id: 0 }
  })

  test('update todo', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const project = await ProjectFactory.create({ user })
    const { id } = await TodoFactory.create({ project })

    const newContent = faker.lorem.words()

    const queryData = {
      query: UpdateTodoMutation,
      variables: { content: newContent, id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.todo.id).toBe(id)
    expect(data.todo.content).toBe(newContent)
    expect(data.todo.completed).toBe(false)

    const todo = await TodoRepository.findOneBy({ id })

    expect(todo.content).toBe(newContent)
  })

  test('can not someone else\'s todo', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [, cookie] = await createUser(client)
    const project = await ProjectFactory.create({ user: otherUser })
    const { id, content } = await TodoFactory.create({ project })

    const queryData = {
      query: UpdateTodoMutation,
      variables: {
        id,
        content: faker.lorem.words(),
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    // Assert it was not changed
    const todo = await TodoRepository.findOneBy({ id })

    expect(todo.content).toBe(content)
  })

  test('setting `completed` property to `true` sets `completedAt` to current time', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const project = await ProjectFactory.create({ user })
    const { id, completedAt } = await TodoFactory.create({ project })

    expect(completedAt).toBeFalsy()

    const queryData = {
      query: UpdateTodoMutation,
      variables: { id, completed: true }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.todo.id).toBe(id)
    expect(data.todo.completed).toBe(true)

    const todo = await TodoRepository.findOneBy({ id })

    expect(todo.completedAt.toDateString()).toBe(new Date().toDateString())
  })

  test('setting `completed` property to `false` set `completedAt` to `null`', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const project = await ProjectFactory.create({ user })
    const { id, completedAt } = await TodoFactory.create({ project, completedAt: new Date() })

    expect(completedAt).toBeTruthy()

    const queryData = {
      query: UpdateTodoMutation,
      variables: { id, completed: false }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.todo.id).toBe(id)
    expect(data.todo.completed).toBe(false)

    const todo = await TodoRepository.findOneBy({ id })

    expect(todo.completedAt).toBeNull()
  })
})

test.group('removeTodo', () => {
  testThrowsIfNotAuthenticated({
    query: RemoveTodoMutation,
    variables: { id: 0 }
  })

  test('remove todo', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const project = await ProjectFactory.create({ user })
    const { id } = await TodoFactory.create({ project })

    const queryData = {
      query: RemoveTodoMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.id).toBe(id)

    const todo = await TodoRepository.findOneBy({ id })

    expect(todo).toBeFalsy()
  })

  test('try to remove someone else\'s todo', async ({ expect, client, createUser }) => {
    const otherUser = await UserFactory.create()
    const [, cookie] = await createUser(client)
    const project = await ProjectFactory.create({ user: otherUser })
    const { id } = await TodoFactory.create({ project })

    const queryData = {
      query: RemoveTodoMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    // Assert it was not deleted
    const todo = await TodoRepository.findOneBy({ id })

    expect(todo).toBeTruthy()
  })
})
