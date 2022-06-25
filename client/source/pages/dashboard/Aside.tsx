import { Box, Show } from "@chakra-ui/react";

export const Aside = () => {
  return (
    <Show above={"md"}>
      <Box as={"aside"} bg={"gray.200"} w={"320px"} flexShrink={0}></Box>
    </Show>
  );
};
