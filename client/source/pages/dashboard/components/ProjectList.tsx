import { Skeleton, Stack } from "@chakra-ui/react";

interface ProjectListProps {
  isLoaded?: boolean;
  children: any;
}

export const ProjectList = ({ isLoaded = false, children }: ProjectListProps) => {
  if (!isLoaded) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );
  }

  return children;
};
