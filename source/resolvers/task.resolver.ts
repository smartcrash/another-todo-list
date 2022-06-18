import { Arg, Ctx, FieldResolver, Int, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
import { Task } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { taskRepository } from "../repository";
import { ContextType } from "../types";

@Resolver(Task)
export class TaskResolver {
  @FieldResolver()
  completed(@Root() root: Task): boolean {
    return !!root.completedAt
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-task'))
  @Mutation(() => Task, { nullable: true })
  async addTask(
    @Arg('description') description: string,
    @Arg('cardId', () => Int) cardId: number,
    @Ctx() { user }: ContextType
  ): Promise<Task | null> {
    if (!description.length) return null

    const task = new Task()
    task.description = description
    task.cardId = cardId
    task.createdById = user.id
    await taskRepository.save(task)

    return task
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-task'))
  @Mutation(() => Task)
  async updateTask(
    @Arg('id', () => Int) id: number,
    @Arg('description', () => String, { nullable: true }) description: string | null,
    @Arg('completed', () => Boolean, { nullable: true }) completed: boolean | null,
  ): Promise<Task> {
    const task = await taskRepository.findOneBy({ id })

    task.description = description && description.length ? description : task.description
    if (completed) task.completedAt = task.completedAt ?? new Date()
    if (!completed) task.completedAt = null

    await taskRepository.save(task)

    return task
  }

  @Mutation(() => Boolean)
  async removeTask(@Arg('id', () => Int) id: number) { }
}
