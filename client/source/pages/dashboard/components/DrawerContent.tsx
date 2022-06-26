import { Button, Divider, Heading, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  useAllDeletedProjectsQuery,
  useAllProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useForceDeleteProjectMutation,
  useRestoreProjectMutation,
} from "../../../generated/graphql";
import { useToggle } from "../../../hooks";
import { route } from "../../../routes";
import { ProjectAdder, ProjectItem, ProjectList } from "./";

export const DrawerContent = () => {
  const navigate = useNavigate();
  const [showDeleted, toggleShowDeleted] = useToggle();
  const [{ data = { projects: [] }, fetching }] = useAllProjectsQuery();
  const [{ data: deleted = { projects: [] }, fetching: fetchingDeleted }] = useAllDeletedProjectsQuery({
    pause: !showDeleted,
  });
  const [, createProject] = useCreateProjectMutation();
  const [, deleteProject] = useDeleteProjectMutation();
  const [, restoreProject] = useRestoreProjectMutation();
  const [, forceDelete] = useForceDeleteProjectMutation();

  const confirmProject = async (title: string) => {
    const { data } = await createProject({ title });

    if (data?.project) {
      const { slug } = data.project;
      navigate(route("project", { slug }));
    }
  };

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

      <ProjectAdder onConfirm={confirmProject} />

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
            <ProjectItem
              project={project}
              onForceDelete={({ id }) => forceDelete({ id })}
              onRestore={({ id }) => restoreProject({ id })}
              key={project.id}
            />
          ))}
        </ProjectList>
      </div>
    </>
  );
};
