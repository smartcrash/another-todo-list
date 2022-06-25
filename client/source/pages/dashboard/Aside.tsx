import { Box, Button, Divider, Heading, Show, Spacer } from "@chakra-ui/react";
import {
  useAllDeletedProjectsQuery,
  useAllProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useRestoreProjectMutation,
} from "../../generated/graphql";
import { useToggle } from "../../hooks";
import { ProjectAdder, ProjectItem, ProjectList } from "./components";

export const Aside = () => {
  const [showDeleted, toggleShowDeleted] = useToggle();
  const [{ data = { projects: [] }, fetching }] = useAllProjectsQuery();
  const [{ data: deleted = { projects: [] }, fetching: fetchingDeleted }] = useAllDeletedProjectsQuery({
    pause: !showDeleted,
  });
  const [, createProject] = useCreateProjectMutation();
  const [, deleteProject] = useDeleteProjectMutation();
  const [, restoreProject] = useRestoreProjectMutation();

  return (
    <Show above={"md"}>
      <Box
        as={"aside"}
        bg={"gray.50"}
        w={"320px"}
        flexShrink={0}
        px={8}
        pt={10}
        borderRightWidth={1}
        borderRightColor={"gray.300"}
      >
        <Heading as="h5" size="sm" color={"gray.600"}>
          Projects
        </Heading>

        <Divider h={5} />

        <ProjectList isLoaded={!fetching}>
          {data.projects.map((project) => (
            <ProjectItem project={project} key={project.id} onDelete={({ id }) => deleteProject({ id })} />
          ))}
        </ProjectList>

        <Divider h={5} />

        <ProjectAdder onConfirm={(title) => createProject({ title })} />

        <Divider h={8} />

        <Button colorScheme={"blackAlpha"} variant={"link"} size={"sm"} onClick={toggleShowDeleted}>
          {showDeleted ? "Hide" : "Show"} deleted
        </Button>

        <Spacer h={4} />

        <div hidden={!showDeleted}>
          <ProjectList isLoaded={!fetchingDeleted}>
            {deleted.projects.map((project) => (
              <ProjectItem project={project} onRestore={({ id }) => restoreProject({ id })} key={project.id} />
            ))}
          </ProjectList>
        </div>
      </Box>
    </Show>
  );
};
