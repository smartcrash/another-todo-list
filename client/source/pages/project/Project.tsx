import { Button, EditableInput, EditablePreview, HStack, Spacer } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { Navigate, useParams } from "react-router-dom";
import { Container, NonEmptyEditable } from "../../components";
import {
  useAddTodoMutation,
  useFindProjectByIdQuery,
  useRemoveTodoMutation,
  useUpdateProjectMutation,
  useUpdateTodoMutation,
} from "../../generated/graphql";
import { useToggle } from "../../hooks";
import { route } from "../../routes";
import { TodoAdder, TodoItem, TodoList } from "./components";

export const Project = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const id = parseInt(slug.slice(slug.lastIndexOf("-") + 1)); // Extract ID from slug

  const [{ data, fetching, error }] = useFindProjectByIdQuery({ variables: { id } });
  const [, updateProject] = useUpdateProjectMutation();
  const [, addTodo] = useAddTodoMutation();
  const [, updateTodo] = useUpdateTodoMutation();
  const [, removeTodo] = useRemoveTodoMutation();

  const [showCompleted, toggleShowCompleted] = useToggle(true);

  if (fetching) return <>Loading</>; // TODO: Add skeleton
  if (!data && error) return <>Something went wrong: {error.message}</>;
  if (!data?.project) return <Navigate to={route("index")} />;

  const { title, todos } = data.project;

  const onTitleUpdate = async (title: string) => {
    const result = await updateProject({ id, title });

    // Update the URL to show the new project's slug
    if (result.data?.project) {
      const newSlug = result.data.project.slug;
      const newUrl = route("project", { slug: newSlug });

      // Change the url but don't a new add the entry to the browser history
      history.replaceState({}, "", newUrl);
    }
  };

  return (
    // NOTE: Add `key` to force re-render so this page is update on re-visits
    <div key={id}>
      <Helmet title={title} />

      <Container maxW={"lg"}>
        <NonEmptyEditable
          defaultValue={title}
          onSubmit={onTitleUpdate}
          fontSize={"3xl"}
          fontWeight={"bold"}
          data-testid={"title-form"}
        >
          <EditablePreview />
          <EditableInput />
        </NonEmptyEditable>

        <Spacer h={2} />

        {!!todos.length && (
          <>
            <HStack justifyContent={"flex-end"}>
              <Button
                colorScheme={"blackAlpha"}
                variant={"ghost"}
                size={"xs"}
                onClick={toggleShowCompleted}
                data-testid={"toggle-show-completed"}
              >
                {showCompleted ? "Hide" : "Show"} completed
              </Button>
            </HStack>

            <Spacer h={2} />

            <TodoList>
              {todos
                .filter((todo) => (!showCompleted ? !todo.completed : true))
                .map((todo) => (
                  <TodoItem
                    todo={todo}
                    onUpdate={(updatedTodo) => updateTodo(updatedTodo)}
                    onDelete={({ id }) => removeTodo({ id })}
                    key={todo.id}
                  />
                ))}
            </TodoList>
          </>
        )}

        <Spacer h={5} />

        <TodoAdder onConfirm={(content) => addTodo({ content, projectId: id })} />
      </Container>
    </div>
  );
};
