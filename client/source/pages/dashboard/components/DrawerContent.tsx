import { Button, Divider, Heading, Spacer } from "@chakra-ui/react";
import {
  useAllDeletedProjectsQuery,
  useAllProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useRestoreProjectMutation,
} from "../../../generated/graphql";
import { useToggle } from "../../../hooks";
import { ProjectAdder, ProjectItem, ProjectList } from "./";

export const DrawerContent = () => {
  const [showDeleted, toggleShowDeleted] = useToggle();
  const [{ data = { projects: [] }, fetching }] = useAllProjectsQuery();
  const [{ data: deleted = { projects: [] }, fetching: fetchingDeleted }] = useAllDeletedProjectsQuery({
    pause: !showDeleted,
  });
  const [, createProject] = useCreateProjectMutation();
  const [, deleteProject] = useDeleteProjectMutation();
  const [, restoreProject] = useRestoreProjectMutation();

  return (
    <>
      <Heading as="h5" size="sm" color={"gray.600"}>
        Projects
      </Heading>

      <Spacer h={5} />

      <ProjectList isLoaded={!fetching} isEmpty={!data.projects.length} data-testid={"project-list"}>
        {data.projects.map((project) => (
          <ProjectItem project={project} key={project.id} onDelete={({ id }) => deleteProject({ id })} />
        ))}
      </ProjectList>

      <Spacer h={5} />

      <ProjectAdder onConfirm={(title) => createProject({ title })} />

      <Divider my={4} borderColor={"gray.300"} />

      <Button
        colorScheme={"blackAlpha"}
        variant={"link"}
        size={"sm"}
        onClick={toggleShowDeleted}
        data-testid={"toggle-show-deleted"}
      >
        {showDeleted ? "Hide" : "Show"} deleted
      </Button>

      <Spacer h={4} />

      <div hidden={!showDeleted}>
        <ProjectList
          isLoaded={!fetchingDeleted}
          isEmpty={!deleted.projects.length}
          placeholder={"No deleted projects"}
          data-testid={"deleted-project-list"}
        >
          {deleted.projects.map((project) => (
            <ProjectItem project={project} onRestore={({ id }) => restoreProject({ id })} key={project.id} />
          ))}
        </ProjectList>
      </div>
    </>
  );
};
