import { Box, Divider, Heading, Show } from "@chakra-ui/react";
import { ProjectAdder } from "./components";

export const Aside = () => {
  return (
    <Show above={"md"}>
      <Box as={"aside"} bg={"gray.50"} w={"320px"} flexShrink={0} px={6} pt={6}>
        <Heading as="h5" size="sm" color={"gray.600"}>
          Projects
        </Heading>

        <Divider h={5} />
        <ProjectAdder onConfirm={(title) => console.log({ title })} />
      </Box>
    </Show>
  );
};
