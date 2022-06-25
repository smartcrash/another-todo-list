import { Skeleton, Stack, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface ProjectListProps {
  isLoaded?: boolean;
  isEmpty?: boolean;
  placeholder?: string;
  children: ReactNode;
}

export const ProjectList = ({
  isLoaded = false,
  isEmpty = false,
  placeholder = "No projects yet",
  children,
}: ProjectListProps) => {
  if (!isLoaded) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  if (isEmpty) {
    return (
      <Text fontSize={"sm"} color={"gray.600"}>
        {placeholder}
      </Text>
    );
  }

  return <>{children}</>;
};
