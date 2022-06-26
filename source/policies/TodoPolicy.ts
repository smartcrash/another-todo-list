import { Todo, User } from "../entity";
import { ProjectRepository } from "../repository";
import { Policy } from "../types";

export class TodoPolicy implements Policy {
  viewAny(user: User) {
    return !!user
  }

  async view(user: User, todo: Todo) {
    const project = await ProjectRepository.findOneByOrFail({ id: todo.projectId })

    return project.userId === user.id
  }

  async create(user: User, todo: Todo) {
    const project = await ProjectRepository.findOneByOrFail({ id: todo.projectId })

    return project.userId === user.id
  }

  async update(user: User, todo: Todo) {
    const project = await ProjectRepository.findOneByOrFail({ id: todo.projectId })

    return project.userId === user.id
  }

  async delete(user: User, todo: Todo) {
    const project = await ProjectRepository.findOneByOrFail({ id: todo.projectId })

    return project.userId === user.id
  }

  async restore(user: User, todo: Todo) {
    const project = await ProjectRepository.findOneByOrFail({ id: todo.projectId })

    return project.userId === user.id
  }

  async forceDelete(user: User, todo: Todo) {
    const project = await ProjectRepository.findOneByOrFail({ id: todo.projectId })

    return project.userId === user.id
  }
}
