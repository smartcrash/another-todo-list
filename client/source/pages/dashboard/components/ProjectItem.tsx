import { Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Project } from "../../../generated/graphql";

interface ProjectItemProps {
  project: Project;
}

export const ProjectItem = ({ project: { title } }: ProjectItemProps) => {
  return (
    <Link to={"TODO: add route"}>
      <Box px={3} py={1.5} borderRadius={"sm"} _hover={{ bg: "gray.200" }}>
        <Text>{title}</Text>
      </Box>
    </Link>
  );
};
