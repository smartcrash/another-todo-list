import { Box, Divider, Heading, Show } from "@chakra-ui/react";
import { useAllProjectsQuery, useCreateProjectMutation, useDeleteProjectMutation } from "../../generated/graphql";
import { ProjectAdder, ProjectItem, ProjectList } from "./components";

export const Aside = () => {
  const [{ data = { projects: [] }, fetching }] = useAllProjectsQuery();
  const [, createProject] = useCreateProjectMutation();
  const [, deleteProject] = useDeleteProjectMutation();

  return (
    <Show above={"md"}>
      <Box
        as={"aside"}
        bg={"gray.50"}
        w={"320px"}
        flexShrink={0}
        px={6}
        pt={10}
        borderRightWidth={1}
        borderRightColor={"gray.300"}
      >
        <Heading as="h5" size="sm" color={"gray.600"} pl={3}>
          Projects
        </Heading>

        <Divider h={5} />

        <ProjectList isLoaded={!fetching}>
          {data.projects.map((project) => (
            <ProjectItem project={project} key={project.id} onDelete={({ id }) => deleteProject({ id })} />
          ))}
        </ProjectList>

        <Divider h={5} />

        <Box pl={3}>
          <ProjectAdder onConfirm={(title) => createProject({ title })} />
        </Box>
      </Box>
    </Show>
  );
};
