import { EditableInput, EditablePreview, Spacer, Stack } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { Navigate, useParams } from "react-router-dom";
import { NonEmptyEditable, Container } from "../../components";
import { useAddTodoMutation, useFindProjectBySlugQuery, useUpdateProjectMutation } from "../../generated/graphql";
import { route } from "../../routes";
import { TodoAdder } from "./components";

export const Project = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [{ data, fetching, error }] = useFindProjectBySlugQuery({ variables: { slug } });
  const [, updateProject] = useUpdateProjectMutation();
  const [, addTodo] = useAddTodoMutation();

  if (fetching) return <>Loading</>; // TODO: Add skeleton
  if (!data && error) return <>Something went wrong: {error.message}</>;
  if (!data?.project) return <Navigate to={route("index")} />;

  const { id, title, todos } = data.project;

  const onTitleUpdate = async (title: string) => {
    const result = await updateProject({ id, title });

    if (result.data?.project) {
      // NOTE: When the project's title is updated it's slug is updated as well.
      //       If we don't update the page URL, on the next re-render `useFindProjectBySlugQuery`
      //       will fail to find the project and the component will rediect to '/'

      const newSlug = result.data.project.slug;
      const newUrl = route("project", { slug: newSlug });

      // Change the url but don't a new add the entry to the browser history
      history.replaceState({}, "", newUrl);
    }
  };

  return (
    <>
      <Helmet title={title} />

      <Container maxW={"lg"} mx={"auto"}>
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

        <Spacer h={10} />

        <Stack>
          {todos.map((todo) => (
            <div key={todo.id}>{todo.content}</div>
          ))}
        </Stack>

        <Spacer h={5} />

        <TodoAdder onConfirm={(content) => addTodo({ content, projectId: id })} />
      </Container>
    </>
  );
};
