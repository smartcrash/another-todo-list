import { faker } from '@faker-js/faker';
import { test } from '@japa/runner';
import { kebabCase } from 'lodash';
import { SESSION_COOKIE } from '../source/constants';
import { ProjectFactory } from '../source/factories';
import { ProjectRepository } from '../source/repository';
import { assertIsForbiddenExeption, testThrowsIfNotAuthenticated } from '../source/utils/testUtils';

const CreateProjectMutation = `
  mutation CreateProject($title: String!) {
    project: createProject(title: $title) {
      id
      title
    }
  }
`

const FindProjectByIdQuery = `
  query FindProjectByIdQuery ($id: Int!) {
    project: findProjectById(id: $id) {
      id
      title
    }
  }
`

const FindProjectBySlugQuery = `
  query FindProjectBySlugQuery($slug: String!) {
    project: findProjectBySlug(slug: $slug) {
      id
      title
    }
  }
`

const AllProjectsQuery = `
  {
    projects: allProjects {
      id
      title
      createdAt
    }
  }
`

const AllDeletedProjectsQuery = `
  {
    projects: allDeletedProjects {
      id
    }
  }
`

const UpdateProjectMutation = `
  mutation UpdateProject($id: Int!, $title: String) {
    project: updateProject(id: $id, title: $title) {
      id
      title
      slug
    }
  }
`

const DeleteProjectMutation = `
  mutation DeleteProject($id: Int!) {
    id: deleteProject(id: $id)
  }
`

const RestoreProjectMutation = `
  mutation RestoreProject($id: Int!) {
    id: restoreProject(id: $id)
  }
`

test.group('createProject', () => {
  testThrowsIfNotAuthenticated({
    query: CreateProjectMutation,
    variables: { title: '' }
  })

  test('should create project', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const title = faker.lorem.words()

    const queryData = {
      query: CreateProjectMutation,
      variables: { title, }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.project).toBeDefined()
    expect(data.project.title).toBe(title)

    const { id } = data.project
    const project = await ProjectRepository.findOneBy({ id })

    expect(project).toBeDefined()
    expect(project.title).toBe(title)
    expect(project.slug.startsWith(kebabCase(title))).toBe(true)
    expect(project.userId).toBe(user.id)
  })
})

test.group('allProjects', () => {
  testThrowsIfNotAuthenticated({
    query: AllProjectsQuery,
    variables: {}
  })

  test('should return only user\'s projects', async ({ expect, client, createUser }) => {
    const [otherUser] = await createUser(client)
    const [user, cookie] = await createUser(client)

    const _ = await ProjectFactory.create({ userId: otherUser.id })
    const project = await ProjectFactory.create({ userId: user.id })

    const queryData = { query: AllProjectsQuery };
    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.projects).toHaveLength(1)
    expect(data.projects[0].id).toBe(project.id)
  })

  test('should omit deleted projects', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const [{ id }] = await ProjectFactory.createMany(3, { userId: user.id })

    await ProjectRepository.softDelete({ id })

    const queryData = { query: AllProjectsQuery };
    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.projects).toHaveLength(2)
    expect(data.projects).not.toContain(expect.arrayContaining([{ id }]))
  })
})

test.group('allDeletedProjects', () => {
  testThrowsIfNotAuthenticated({
    query: AllDeletedProjectsQuery,
    variables: { id: -1 }
  })

  test('should only include deleted projects', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const [{ id }] = await ProjectFactory.createMany(3, { userId: user.id })
    await ProjectRepository.softDelete({ id })

    const queryData = { query: AllDeletedProjectsQuery };
    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.projects).toHaveLength(1)
    expect(data.projects[0].id).toBe(id)
  })
})

test.group('findProjectById', () => {
  testThrowsIfNotAuthenticated({
    query: FindProjectByIdQuery,
    variables: { id: 1 }
  })

  test('should return single project', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id, title } = await ProjectFactory.create({ userId: user.id })

    const queryData = {
      query: FindProjectByIdQuery,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.project).toBeDefined()
    expect(data.project.id).toBe(id)
    expect(data.project.title).toBe(title)
  })

  test('should return `null` if it was not created by the user', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [cookie] = await createUser(client)
    const { id } = await ProjectFactory.create({ userId: user.id })

    const queryData = {
      query: FindProjectByIdQuery,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.project).toBeNull()
  })
})

test.group('findProjectById', () => {
  testThrowsIfNotAuthenticated({
    query: FindProjectBySlugQuery,
    variables: { slug: '' }
  })

  test('should return project by slug', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id, slug } = await ProjectFactory.create({ userId: user.id })

    const queryData = {
      query: FindProjectBySlugQuery,
      variables: { slug }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.project).toBeDefined()
    expect(data.project.id).toBe(id)
  })

  test('should return `null` if it was not created by the user', async ({ expect, client, createUser }) => {
    const [otherUser] = await createUser(client)
    const [cookie] = await createUser(client)
    const { slug } = await ProjectFactory.create({ userId: otherUser.id })

    const queryData = {
      query: FindProjectBySlugQuery,
      variables: { slug }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.project).toBeNull()
  })
})

test.group('updateProject', () => {
  testThrowsIfNotAuthenticated({
    query: UpdateProjectMutation,
    variables: { id: 1 }
  })

  test('should update Project and return updated entity', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)
    const { id } = await ProjectFactory.create({ userId: user.id })
    const title = faker.lorem.words()

    const queryData = {
      query: UpdateProjectMutation,
      variables: {
        id,
        title,
      }
    }

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.project.id).toBe(id)
    expect(data.project.title).toBe(title)
    expect(data.project.slug.startsWith(kebabCase(title))).toBe(true)
  })

  test('should only be allowed to update if is owner', async ({ expect, client, createUser }) => {
    const [otherUser] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id, title } = await ProjectFactory.create({ userId: otherUser.id })

    const queryData = {
      query: UpdateProjectMutation,
      variables: {
        id,
        title: faker.lorem.paragraph()
      }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const project = await ProjectRepository.findOneBy({ id })

    expect(project).toBeDefined()
    expect(project.title).toBe(title) // It should not have changed
  })
})

test.group('deletProject', () => {
  testThrowsIfNotAuthenticated({
    query: DeleteProjectMutation,
    variables: { id: -1 }
  })

  test('should soft delete project', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const { id } = await ProjectFactory.create({ userId: user.id })

    const queryData = {
      query: DeleteProjectMutation,
      variables: { id }
    };


    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data } = response.body()

    expect(data.id).toBeDefined()
    expect(data.id).toBe(id)

    const project = await ProjectRepository.findOne({ where: { id }, withDeleted: true })

    expect(project).not.toBeNull()
    expect(project.deletedAt).toBeDefined()
    expect(project.deletedAt.toDateString()).toBe(new Date().toDateString())
  })

  test('should not be able to delete someone else\'s project', async ({ expect, client, createUser }) => {
    const [otherUser] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id } = await ProjectFactory.create({ userId: otherUser.id })

    const queryData = {
      query: DeleteProjectMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const project = await ProjectRepository.findOne({ where: { id }, withDeleted: true })

    expect(project).toBeDefined()
    expect(project.deletedAt).toBeNull()
  })
})

test.group('restoreProject', () => {
  testThrowsIfNotAuthenticated({
    query: RestoreProjectMutation,
    variables: { id: -1 }
  })

  test('should restore deleted project', async ({ expect, client, createUser }) => {
    const [user, cookie] = await createUser(client)

    const { id } = await ProjectFactory.create({ userId: user.id })
    await ProjectRepository.softDelete({ id })

    // Ensure that is initialy deleted
    expect((await ProjectRepository.findOne({
      where: { id },
      withDeleted: true
    })).deletedAt).not.toBeNull()

    const queryData = {
      query: RestoreProjectMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)
    const { data, errors } = response.body()

    expect(errors).toBeFalsy()
    expect(data).toBeTruthy()

    expect(data.id).toBeDefined()
    expect(data.id).toBe(id)

    const project = await ProjectRepository.findOneBy({ id })

    expect(project).not.toBeNull()
    expect(project.deletedAt).toBeNull()
  })

  test('should only be able to restore owned projects', async ({ expect, client, createUser }) => {
    const [user] = await createUser(client)
    const [, cookie] = await createUser(client)

    const { id } = await ProjectFactory.create({ userId: user.id })
    await ProjectRepository.softDelete({ id })

    // Ensure that is initialy deleted
    expect((await ProjectRepository.findOne({
      where: { id },
      withDeleted: true
    })).deletedAt).not.toBeNull()

    const queryData = {
      query: RestoreProjectMutation,
      variables: { id }
    };

    const response = await client.post('/').cookie(SESSION_COOKIE, cookie).json(queryData)

    assertIsForbiddenExeption({ response, expect })

    const project = await ProjectRepository.findOne({
      where: { id },
      withDeleted: true
    })

    expect(project).not.toBeNull()
    expect(project.deletedAt).not.toBeNull()
  })
})
