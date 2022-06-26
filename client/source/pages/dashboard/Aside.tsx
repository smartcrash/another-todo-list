import { Box, Show } from "@chakra-ui/react";
import { Drawer, DrawerContent } from "./components";

export const Aside = () => {
  return (
    <>
      <Show below={"md"}>
        <Drawer />
      </Show>

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
          <DrawerContent />
        </Box>
      </Show>
    </>
  );
};
