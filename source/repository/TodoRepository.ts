import { dataSource } from "../dataSource";
import { Todo } from "../entity";

export const TodoRepository = dataSource.getRepository(Todo)
