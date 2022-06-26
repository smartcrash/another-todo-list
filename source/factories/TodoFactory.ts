import { faker } from '@faker-js/faker'
import { Todo } from '../entity'
import { EntityFactory } from '../EntityFactory'

export const TodoFactory = new EntityFactory(Todo, () => {
  const todo = new Todo()
  todo.content = faker.lorem.words(5)
  return todo
})
