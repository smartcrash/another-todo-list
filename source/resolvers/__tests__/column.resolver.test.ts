import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { SESSION_COOKIE } from '../../constants';
import { dataSource } from '../../dataSource';
import { Column } from '../../entity';
import { createRandomBoard, createRandomColumn } from '../../utils/testUtils';

const AddColumnMutation = `
  mutation AddColumn($boardId: Int!, $title: String!, $index: Int) {
    column: addColumn(boardId: $boardId, title: $title, index: $index) {
      id
      title
      index
    }
  }
`

const UpdateColumnMutation = `
  mutation UpdateColumn($id: Int!, $title: String, $index: Int) {
    column: updateColumn(id: $id, title: $title, index: $index) {
      id
      title
      index
    }
  }
`

const DeleteColumnMutation = `
  mutation DeleteColumn($id: Int!) {
    id: deleteColumn(id: $id)
  }
`

test.group('addBoard', () => {
  test('should throw error not authenticated', async ({ expect, client }) => {
    const queryData = {
      query: AddColumnMutation,
      variables: {
        boardId: -1,
        title: '',
      }
    };

    const response = await client.post('/').json(queryData)
    const { data, errors } = response.body()

    expect(data.column).toBeFalsy()
    expect(errors).toBeDefined()
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toBe('not authenticated')
  })

  test('should add column at index to existing board', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const title = faker.lorem.words()
    const index = faker.datatype.number()

    const queryData = {
      query: AddColumnMutation,
      variables: {
        boardId,
        title,
        index
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()

    expect(data.column).toBeTruthy()
    expect(typeof data.column.id).toBe('number')
    expect(data.column.title).toBe(title)
    expect(data.column.index).toBe(index)

    const { id } = data.column
    const column = await dataSource.getRepository(Column).findOneBy({ id })

    expect(column).toBeTruthy()
    expect(column.boardId).toBe(boardId)
  })

  test('can not add column to someone else\'s board', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)

    const queryData = {
      query: AddColumnMutation,
      variables: {
        boardId,
        title: faker.lorem.word(),
        index: 0,
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.column).toBeFalsy()
  })
})

test.group('updateColumn', () => {
  test('should update column', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id } = await createRandomColumn(boardId)

    const title = faker.lorem.words()
    const index = faker.datatype.number()

    const queryData = {
      query: UpdateColumnMutation,
      variables: {
        id,
        title,
        index
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()

    expect(data.column).toBeTruthy()
    expect(data.column.id).toBe(id)
    expect(data.column.title).toBe(title)
    expect(data.column.index).toBe(index)

    const column = await dataSource.getRepository(Column).findOneBy({ id })

    expect(column).toMatchObject({ title, index })
  })

  test('can\'t update someone else board\'s column', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id: boardId } = await createRandomBoard(user.id)
    const { id, title } = await createRandomColumn(boardId)

    const queryData = {
      query: UpdateColumnMutation,
      variables: {
        id,
        title: faker.lorem.words(),
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.errors).toBeFalsy()
    expect(data.column).toBeFalsy()

    const column = await dataSource.getRepository(Column).findOneBy({ id })

    expect(column.title).toBe(title)
  })
})

test.group('deleteColumn', () => {
  test('should delete column', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id: boardId } = await createRandomBoard(user.id)
    const { id } = await createRandomColumn(boardId)

    const queryData = {
      query: DeleteColumnMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data.id).toBe(id)

    const column = await dataSource.getRepository(Column).findOneBy({ id })

    expect(column).toBeFalsy()
  })

  test('can\'t delete someone else board\'s column', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id: boardId } = await createRandomBoard(user.id)
    const { id } = await createRandomColumn(boardId)

    const queryData = {
      query: DeleteColumnMutation,
      variables: { id, }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.errors).toBeFalsy()
    expect(data.id).toBeFalsy()

    const column = await dataSource.getRepository(Column).findOneBy({ id })

    expect(column).toBeTruthy()
  })

  test('cascades and deletes all related cards')
})


