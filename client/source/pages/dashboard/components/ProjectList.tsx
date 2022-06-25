import { Box, HTMLChakraProps, Skeleton, Stack, Text } from "@chakra-ui/react";

interface ProjectListProps extends HTMLChakraProps<"div"> {
  isLoaded?: boolean;
  isEmpty?: boolean;
  placeholder?: string;
}

export const ProjectList = ({
  isLoaded = false,
  isEmpty = false,
  placeholder = "No projects yet",
  children,
  ...boxProps
}: ProjectListProps) => {
  let content = children;

  if (!isLoaded) {
    content = (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  } else if (isEmpty) {
    content = (
      <Text fontSize={"sm"} color={"gray.600"}>
        {placeholder}
      </Text>
    );
  }

  return <Box {...boxProps}>{content}</Box>;
};
