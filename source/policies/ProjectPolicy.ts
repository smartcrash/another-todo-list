import { Project, User } from "../entity";
import { Policy } from "../types";

export class ProjectdPolicy implements Policy {
  viewAny(user: User) {
    return !!user
  }

  view(user: User, project: Project) {
    return user.id === project.userId
  }

  create(user: User) {
    return !!user
  }

  update(user: User, project: Project) {
    return user.id === project.userId
  }

  delete(user: User, project: Project) {
    return user.id === project.userId
  }

  restore(user: User, project: Project) {
    return user.id === project.userId
  }

  forceDelete(user: User, project: Project) {
    return user.id === project.userId
  }
}
