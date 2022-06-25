import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { IsNull, Not } from "typeorm";
import { Project } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { ProjectRepository } from "../repository/ProjectRepository";
import { ContextType } from '../types';


@Resolver(Project)
export class ProjectResolver {
  @UseMiddleware(Authenticate)
  @Query(() => [Project])
  async allProjects(
    @Ctx() { user }: ContextType
  ): Promise<Project[]> {
    const projects = await ProjectRepository.findBy({ userId: user.id })

    return projects
  }

  @UseMiddleware(Authenticate)
  @Query(() => [Project])
  async allDeletedProjects(
    @Ctx() { user }: ContextType
  ): Promise<Project[]> {
    return ProjectRepository
      .find({
        where: {
          userId: user.id,
          deletedAt: Not(IsNull()),
        },
        order: { deletedAt: 'DESC' },
        withDeleted: true
      })
  }

  @UseMiddleware(Authenticate)
  @Query(() => Project, { nullable: true })
  async findProjectById(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType
  ): Promise<Project> {
    return ProjectRepository
      .findOne({
        relations: { user: true },
        where: { id, userId: user.id }
      })
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-project'))
  @Mutation(() => Project)
  async createProject(
    @Arg('title') title: string,
    @Ctx() { user }: ContextType
  ): Promise<Project> {
    const project = new Project()

    project.title = title
    project.userId = user.id

    await ProjectRepository.save(project)

    return project
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-project'))
  @Mutation(() => Project, { nullable: true })
  async updateProject(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string | null,
    @Ctx() { user }: ContextType
  ): Promise<Project | null> {
    const project = await ProjectRepository.findOneBy({ id, userId: user.id })

    if (!project) return null

    project.title = title ?? project.title

    await ProjectRepository.save(project)

    return project
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-project'))
  @Mutation(() => Int, { nullable: true })
  async deleteProject(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType
  ): Promise<number | null> {
    await ProjectRepository.softDelete({ id, userId: user.id })

    return id
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('restore-project'))
  @Mutation(() => Int, { nullable: true })
  async restoreProject(
    @Arg('id', () => Int) id: number,
    @Ctx() { user }: ContextType
  ): Promise<number | null> {
    await ProjectRepository.restore({ id, userId: user.id })

    return id
  }
}
