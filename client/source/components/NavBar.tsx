import { Avatar, Box, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { Container, Logo } from "./";

function NavBar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Container as={"nav"} bg={"primary.500"}>
      <HStack justifyContent={"space-between"} h={16}>
        <Logo color={"white"} />

        <Menu>
          <MenuButton>
            <HStack>
              <Text color={"white"} fontWeight={"semibold"} fontSize={"sm"}>
                {user.username}
              </Text>
              <Avatar name={user.username} bg={"gray.100"} color={"black"} size={"sm"} />
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <HStack>
                <Avatar name={user.username} bg={"primary.500"} />
                <Box>
                  <Text fontSize={"sm"}>{user.username}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    {user.email}
                  </Text>
                </Box>
              </HStack>
            </MenuItem>

            <MenuDivider />

            <MenuItem onClick={() => logout()} data-testid={"logout"}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Container>
  );
}

export default NavBar;
