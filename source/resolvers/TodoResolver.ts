import { Arg, FieldResolver, Int, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { IsNull } from "typeorm";
import { Todo } from "../entity";
import { AllowIf } from "../middlewares/AllowIf";
import { Authenticate } from "../middlewares/Authenticate";
import { TodoRepository } from "../repository";

@Resolver(Todo)
export class TodoResolver {
  @FieldResolver()
  completed(@Root() root: Todo): boolean {
    return !!root.completedAt
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('create-todo'))
  @Mutation(() => Todo, { nullable: true })
  async addTodo(
    @Arg('content',) content: string,
    @Arg('projectId', () => Int) projectId: number,
  ): Promise<Todo | null> {
    if (!content.length) return null

    const todo = new Todo()
    todo.content = content
    todo.projectId = projectId
    await TodoRepository.save(todo)

    return todo
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('update-todo'))
  @Mutation(() => Todo)
  async updateTodo(
    @Arg('id', () => Int) id: number,
    @Arg('content', () => String, { nullable: true }) content: string | null,
    @Arg('completed', () => Boolean, { nullable: true }) completed: boolean | null,
  ): Promise<Todo> {
    const todo = await TodoRepository.findOneBy({ id })

    if (!todo.completedAt) {
      if (content?.length) todo.content = content
      if (completed === true) todo.completedAt = new Date()

      await TodoRepository.save(todo)
    }

    return todo
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-todo'))
  @Mutation(() => Int)
  async removeTodo(@Arg('id', () => Int) id: number): Promise<number> {
    await TodoRepository.delete({ id, completedAt: IsNull() })

    return id
  }
}
