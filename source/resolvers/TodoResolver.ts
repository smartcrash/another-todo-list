import { Arg, FieldResolver, Int, Mutation, Resolver, Root, UseMiddleware } from "type-graphql";
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
    @Arg('content') content: string,
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

    todo.content = content && content.length ? content : todo.content
    if (completed) todo.completedAt = todo.completedAt ?? new Date()
    if (!completed) todo.completedAt = null

    await TodoRepository.save(todo)

    return todo
  }

  @UseMiddleware(Authenticate)
  @UseMiddleware(AllowIf('delete-todo'))
  @Mutation(() => Int)
  async removeTodo(@Arg('id', () => Int) id: number): Promise<number> {
    await TodoRepository.delete({ id })

    return id
  }
}
