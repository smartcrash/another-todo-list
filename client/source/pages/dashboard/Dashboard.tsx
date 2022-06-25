import { HStack, Stack } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import { Container } from "../../components";
import { Aside } from "./Aside";
import NavBar from "./NavBar";

export const Dashboard = () => {
  return (
    <>
      <Helmet title={"Home"} />

      <Stack h={"100vh"} spacing={0}>
        <NavBar />
        <HStack alignItems={"stretch"} flexGrow={1} spacing={0}>
          <Aside />
          <Container flexGrow={1} pt={6} as={"main"}>
            <Outlet />
          </Container>
        </HStack>
      </Stack>
    </>
  );
};
