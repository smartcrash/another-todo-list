import { test } from "@japa/runner"
import { SESSION_COOKIE } from "../../constants"
import { UserRepository } from "../../repository"
import { assertIsForbiddenExeption, createRandomBoard, testThrowsIfNotAuthenticated } from "../../utils/testUtils"

const AllFavoritesQuery = `
  query AllFavorites {
    favorites: allFavorites {
      id
    }
  }
`

const AddToFavoritesMutation = `
  mutation AddToFavorites($id: Int!) {
    addToFavorites(id: $id)
  }
`

const RemoveFromFavoritesMutation = `
  mutation RemoveFromFavorites($id: Int!) {
    removeFromFavorites(id: $id)
  }
`


test.group('allFavorites', () => {
  testThrowsIfNotAuthenticated({
    query: AllFavoritesQuery,
    variables: {}
  })

  test('get user\'s favorites list', async ({ expect, client, createUser }) => {
    const [{ id: userId }, cookie] = await createUser(client)

    const board1 = await createRandomBoard(userId)
    const board2 = await createRandomBoard(userId)
    const board3 = await createRandomBoard(userId)

    const user = await UserRepository.findOne({
      where: { id: userId },
      relations: { favorites: true }
    })

    user.favorites = [board2, board3]

    await UserRepository.save(user)


    const queryData = {
      query: AllFavoritesQuery,
      variables: {}
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(Array.isArray(data.favorites)).toBeTruthy()
    expect(data.favorites).toHaveLength(2)
    expect(data.favorites).not.toContain(expect.arrayContaining([{ id: board1.id }]))
  })
})

test.group('addToFavorites', () => {
  testThrowsIfNotAuthenticated({
    query: AddToFavoritesMutation,
    variables: { id: 0 }
  })

  test('it add board to user\'s favorites', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const { id } = await createRandomBoard(user.id)
    await createRandomBoard(user.id)

    const queryData = {
      query: AddToFavoritesMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()
    expect(data.addToFavorites).toBe(true)

    const { favorites } = await UserRepository.findOne({
      where: { id: user.id },
      relations: { favorites: true }
    })

    expect(favorites).toHaveLength(1)
    expect(favorites[0].id).toBe(id)
  })

  test('can only favorite boards that has access to', async ({ expect, client, createUser }) => {
    const [user,] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id } = await createRandomBoard(user.id)

    const queryData = {
      query: AddToFavoritesMutation,
      variables: { id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const { favorites } = await UserRepository.findOne({
      where: { id: user.id },
      relations: { favorites: true }
    })

    expect(favorites).toHaveLength(0)
  })
})

test.group('removeFromFavorites', () => {
  testThrowsIfNotAuthenticated({
    query: RemoveFromFavoritesMutation,
    variables: { id: 0 }
  })

  test('it removes board from user\'s favorites', async ({ expect, client, createUser }) => {
    const [{ id: userId }, cookie] = await createUser(client)
    const board = await createRandomBoard(userId)

    const user = await UserRepository.findOneByOrFail({ id: userId })
    user.favorites = [board]
    await UserRepository.save(user)

    const queryData = {
      query: RemoveFromFavoritesMutation,
      variables: { id: board.id }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()
    expect(data.removeFromFavorites).toBe(true)

    const { favorites } = await UserRepository.findOne({
      where: { id: user.id },
      relations: { favorites: true }
    })

    expect(favorites).toHaveLength(0)
  })
})
