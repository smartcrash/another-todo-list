import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent as ChakraDrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { DrawerContent } from "./DrawerContent";

export const Drawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        position={"absolute"}
        top={"15px"}
        left={{ base: "5px", sm: "35px" }}
        variant={"ghost"}
        size={"sm"}
        leftIcon={<HamburgerIcon />}
        onClick={onOpen}
      >
        {isOpen ? "Close menu" : "Open menu"}
      </Button>

      <ChakraDrawer isOpen={isOpen} placement={"left"} onClose={onClose} size={"sm"}>
        <DrawerOverlay />
        <ChakraDrawerContent bg={"gray.50"}>
          <DrawerCloseButton />
          <DrawerBody pt={10} px={10}>
            <DrawerContent />
          </DrawerBody>
        </ChakraDrawerContent>
      </ChakraDrawer>
    </>
  );
};
