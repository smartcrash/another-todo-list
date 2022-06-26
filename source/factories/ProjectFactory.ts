
import { faker } from '@faker-js/faker'
import { Project } from '../entity'
import { EntityFactory } from '../EntityFactory'

export const ProjectFactory = new EntityFactory(Project, () => {
  const project = new Project()
  project.title = faker.lorem.words()
  return project
})
